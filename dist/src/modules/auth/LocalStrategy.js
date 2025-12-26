"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_local_1 = require("passport-local");
class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    authService;
    constructor(authService) {
        super({
            usernameField: 'user_name',
            passwordField: 'pass',
        });
        this.authService = authService;
    }
    async validate(user_name, pass) {
        const user = await this.authService.validateUser({ user_name, pass });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
}
exports.LocalStrategy = LocalStrategy;
//# sourceMappingURL=LocalStrategy.js.map