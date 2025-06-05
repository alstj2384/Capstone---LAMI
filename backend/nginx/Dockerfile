FROM openresty/openresty:alpine-fat

# luarocks 설치
RUN apk add --no-cache curl git luarocks

# lua-resty-jwt 설치
RUN luarocks install lua-resty-jwt