import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(req.headers);
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
};

export const verifyAdmin = (req, res, next) => {
    if (req.decoded.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' })
    }
    next();
}

// const verifySellerAdmin = async (req, res, next) => {
//     const decodedEmail = req.decoded.email;
//     const query = { email: decodedEmail };
//     const user = await userCollection.findOne(query);

//     if (user?.accountType === 'Buyer') {
//         return res.status(403).send({ message: 'forbidden access' })
//     }
//     next();
// }