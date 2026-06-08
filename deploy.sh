#!/bin/bash

# ==============================================================================
# Script Triển Khai Trang Profile baoduong.dev Lên Server Ubuntu (Nginx + SSL)
# ==============================================================================

# Set logs output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
NC_BOLD='\033[1m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Check for root privileges
if [ "$EUID" -ne 0 ]; then
    log_error "Vui lòng chạy script này bằng quyền root (sử dụng sudo ./deploy.sh hoặc sudo bash deploy.sh)"
    exit 1
fi

DOMAIN="baoduong.dev"
WEB_ROOT="/var/www/$DOMAIN/html"

log_info "Bắt đầu thiết lập môi trường và triển khai trang profile cho $DOMAIN..."

# 2. Update system packages
log_info "Đang cập nhật các gói hệ thống..."
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git build-essential ufw

# 3. Install Nginx
if ! command -v nginx &> /dev/null; then
    log_info "Đang cài đặt Nginx..."
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_success "Đã cài đặt Nginx và kích hoạt dịch vụ thành công."
else
    log_info "Nginx đã được cài đặt."
fi

# 4. Prepare Web Root directory
log_info "Đang chuẩn bị thư mục lưu trữ web tại $WEB_ROOT..."
mkdir -p "$WEB_ROOT"

# Copy static files to the Web Root directory
log_info "Đang sao chép các tệp tin tĩnh (HTML, CSS, JS) vào thư mục web..."
cp -R index.html css js "$WEB_ROOT/"

# Set correct ownership and permissions
log_info "Đang phân quyền thư mục cho user www-data..."
chown -R www-data:www-data "/var/www/$DOMAIN"
chmod -R 755 "/var/www/$DOMAIN"

# 5. Create Nginx Server Block Configuration
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
log_info "Tạo cấu hình Nginx Server Block tại $NGINX_CONF..."

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN www.$DOMAIN;
    root $WEB_ROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Browser caching optimization for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Enable the Nginx site by creating a symlink
if [ ! -f "/etc/nginx/sites-enabled/$DOMAIN" ]; then
    log_info "Đang kích hoạt cấu hình Nginx..."
    ln -s "$NGINX_CONF" "/etc/nginx/sites-enabled/"
fi

# Disable the default site if it exists to avoid conflicts
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    log_info "Đang vô hiệu hóa cấu hình site mặc định (default)..."
    rm -f "/etc/nginx/sites-enabled/default"
fi

# Test Nginx configuration and reload
log_info "Đang kiểm tra và tải lại cấu hình Nginx..."
if nginx -t; then
    systemctl reload nginx
    log_success "Cấu hình Nginx hoạt động tốt!"
else
    log_error "Cấu hình Nginx bị lỗi. Vui lòng kiểm tra lại cấu hình."
    exit 1
fi

# 6. Configure UFW Tường lửa
log_info "Đang thiết lập tường lửa (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
# ufw --force enable # Khuyến khích người dùng tự bật để an toàn

# 7. Install Certbot for Let's Encrypt SSL
# Note: Tên miền .dev BẮT BUỘC phải dùng HTTPS.
log_info "Đang kiểm tra cài đặt Certbot để cấu hình SSL..."
if ! command -v certbot &> /dev/null; then
    log_info "Đang cài đặt Certbot và Nginx plugin..."
    apt-get install -y certbot python3-certbot-nginx
    log_success "Đã cài đặt Certbot thành công."
else
    log_info "Certbot đã được cài đặt từ trước."
fi

log_success "--------------------------------------------------------"
log_success "QUÁ TRÌNH THIẾT LẬP CƠ BẢN HOÀN TẤT THÀNH CÔNG!"
log_success "Thư mục Web Root: $WEB_ROOT"
log_success "Nginx đã được cấu hình phục vụ trên cổng 80."
log_success "--------------------------------------------------------"
log_warn "BƯỚC TIẾP THEO CẦN LÀM THỦ CÔNG:"
log_warn "1. Hãy chắc chắn rằng bạn đã trỏ DNS (bản ghi A) của tên miền $DOMAIN về IP của Server này."
log_warn "2. Chạy câu lệnh sau trên Server để lấy chứng chỉ SSL tự động và cấu hình HTTPS:"
log_warn "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
log_success "--------------------------------------------------------"
