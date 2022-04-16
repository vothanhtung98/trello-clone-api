import { WHITELIST_DOMAINS } from '*/utilities/constants'
export const corsOptions = {
    origin: function (origin, callback) {
        if (WHITELIST_DOMAINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}