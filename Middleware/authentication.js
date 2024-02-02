const {validateToken} = require("../Services/authenticate")

function checkforAuthenticationCookie(cookieName)
{
  return(req,res,next)=>{
   const tokencookieValue = req.cookies[cookieName]
   if(!tokencookieValue)
   {
    return next();
   }


   try {
    const userPayload =  validateToken(tokencookieValue);
    req.user = userPayload;
    return next();
    
   } catch (error) {}
   return next();
  };

}

module.exports = {checkforAuthenticationCookie};