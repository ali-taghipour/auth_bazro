const Exception = require("../helpers/errorHelper")
const redisSessionStore = require("../database/redisSessionStore")
const sessionRepo = require("../repositories/sessionRepo")

//converting session.save() callback to promise
const sessionSave = async (req) => {
    return new Promise((resolve, reject) => {
        req.session.save((err) => {
            if (err) reject(err)
            resolve()
        })
    })
}
//converting session.destroy() callback to promise
const sessionDestroy = async (req) => {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(err)
            resolve()
        })
    })
}
//getting session information from Redis(sessionStorage) by session.id & converting this callback function to promise
const redisSessionStoreGetter = async (sid) => {
    return new Promise((resolve, reject) => {
        redisSessionStore.get(sid, (err, session) => {
            if (err) reject(err)
            resolve(session)
        })
    })
}
//saving session information in Redis(sessionStorage) by session.id & converting this callback function to promise
const redisSessionStoreSetter = async (sid, session) => {
    return new Promise((resolve, reject) => {
        redisSessionStore.set(sid, session, (err) => {
            if (err) reject(err)
            resolve()
        })
    })
}
//removing session information in Redis(sessionStorage) by session.id & converting this callback function to promise
const redisSessionStoreDestroy = async (sid) => {
    return new Promise((resolve, reject) => {
        redisSessionStore.destroy(sid, (err) => {
            if (err) reject(err)
            resolve()
        })
    })
}
module.exports.redisSessionStoreDestroy = redisSessionStoreDestroy
//-----------------------------------------------

//add user_id in session if not exist and make a 
module.exports.setSessionForUser = async (req, user_id) => {
    //for safe development in windows (redisStorage not working in redis windows)
    if (process.env.WITHOUT_SESSION) {
        return;
    }
    //checking current session has user_id or not
    //if session has not any user_id this means it is a new session for user 
    if (!req.session.user_id) {
        //getting number of sessions which this user have (from sessionModel) and should not biger than 3
        if (await sessionRepo.getNumberOfUserSessions(user_id) >= 3) {
            return Exception.setError("you cant have more than 3 active session")
        }
        //add this session for user (in sessionModel)
        await sessionRepo.addNewSession(user_id, req.session.id)
        req.session.user_id = user_id
        req.session.block_status = false //default block_status value
        await sessionSave(req)
    }
}

//change block_status for session
module.exports.setSessionBlockStatusBySessonModel = async (session, block_status) => {
    if (session) {
        const sessionData = await redisSessionStoreGetter(session.session_id)
        if (sessionData) {
            sessionData.block_status = block_status
            await redisSessionStoreSetter(session.session_id, sessionData)
        }
    }
}

//remove current session from sessionStorage and sessionModel (in logout)
module.exports.deleteSession = async (req) => {
    //if userType was admin or superAdmin (user_id in session exist just in user (after login/register)
    if (!req.session.user_id) {
        return await sessionDestroy(req)
    }
    const sessionId = req.session.id
    const userId = req.session.user_id
    await sessionRepo.removeSessionByUserId(userId, sessionId) //removing session from model
    await redisSessionStoreDestroy(sessionId) //removing session from sessionStorage(redis)
}