local jwt = require "resty.jwt"

local _M = {}

function _M.check()
    ngx.log(ngx.INFO, "JWT check started")

    local auth_header = ngx.var.http_Authorization
    if not auth_header then
        ngx.log(ngx.WARN, "Missing Authorization header")
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.say("Missing Authorization header")
        return ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end

    local _, _, token = string.find(auth_header, "Bearer%s+(.+)")
    if not token then
        ngx.log(ngx.WARN, "Invalid Authorization header format: " .. (auth_header or "nil"))
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.say("Invalid Authorization header format")
        return ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end

    local secret = os.getenv("JWT_SECRET")
    secret = string.gsub(secret, "%s+$", "")
    if not secret or secret == "" then
        ngx.log(ngx.ERR, "JWT_SECRET environment variable is missing or empty")
    end

    ngx.log(ngx.INFO, "Verifying JWT...")
    local decoded = jwt:verify(secret, token)

    if not decoded.verified then
        ngx.log(ngx.WARN, "JWT verification failed: " .. (decoded.reason or "unknown"))
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.say("JWT verification failed: " .. (decoded.reason or "unknown"))
        return ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end

    ngx.log(ngx.INFO, "JWT verification succeeded")

    local user_id = decoded.payload.memberId
    if user_id then
        ngx.log(ngx.INFO, "Setting X-User-Id header with memberId: " .. tostring(user_id))
        ngx.req.set_header("X-User-Id", user_id)
    else
        ngx.log(ngx.WARN, "memberId not found in JWT payload")
    end
end

return _M