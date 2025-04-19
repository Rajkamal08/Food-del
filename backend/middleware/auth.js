// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const { token } = req.headers;
//   if (!token) {
//     return res.json({
//       success: false,
//       message: "Not Authorized. Please Login Again",
//     });
//   }
//   try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { userId: token_decode.id };
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Authorization Error" });
//   }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers["token"]; // ✅ Correct way to fetch token from headers

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please Login Again",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!token_decode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token Structure",
      });
    }

    req.user = { userId: token_decode.id }; // ✅ Attach user ID to `req.user`
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Authorization Error" });
  }
};

export default authMiddleware;
