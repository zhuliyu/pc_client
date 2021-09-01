#基础镜像为nginx
FROM nginx

#签名 作者信息
MAINTAINER author "zhangshunshun@honeycombtech.com"

# 添加dist
COPY ./ /usr/share/nginx/html/yyzx/

# 映射nginx配置
#COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf

# 映射nginx配置
# VOLUME ["/home/yyzx/yyzx-service/dist/nginx.conf","/etc/nginx/nginx.conf"]

# CMD ["start","nginx"]
