import express from 'express';
import database from '../db/mongodb.js';
import { verifyAdmin, verifyJwt } from '../middlewares/userValidator.js';
import { ObjectId } from 'mongodb';
var router = express.Router();

const questionCollection = database.collection("questions");

try {
    router.post('/', verifyJwt, verifyAdmin, async (req, res) => {

        try {
            let options = req.body.option1
            const newQuestion = {
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer,
            };
            const query = { question: req.body.question };

            const foundQuestion = await questionCollection.findOne(query);

            if (!foundQuestion) {
                console.log("Question not found");
                const result = await questionCollection.insertOne(newQuestion);
                return res.status(200).json({
                    success: true,
                    message: "Question added successfully!",
                });
            }
            res.send({ success: false, error: "Question Already in use!" });
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: 'Duplicate question' })
        }

    });

    router.get('/', async (request, response) => {

        const questions = await questionCollection.find({}).toArray();
        response.json(questions);

    })


    router.put('/:id', async (request, response) => {
        const id = request.params.id;
        const query = { _id: ObjectId(id) };
        const update = {
            $set: {
                question: request.body.question,
                options: request.body.options,
                answer: request.body.answer,
            },
        };
        const options = { upsert: true };
        const updatedQuestion = await questionCollection.updateOne(
            query,
            update,
            options
        );
        if (updatedQuestion.modifiedCount === 0) {
            return response.json({ success: false, message: 'Question not found' });
        } else {
            response.json({ success: true, updatedQuestion });
        }
    })

    router.delete('/:id', async (request, response) => {
        const id = request.params.id;
        const query = { _id: ObjectId(id) };
        const deletedQuestion = await questionCollection.deleteOne(query);
        if (deletedQuestion.deletedCount === 0) {
            return response.json({ success: false, message: 'Question not found' });
        } else {
            response.json({ success: true, deletedQuestion });
        }
    });
}
catch (error) {
    console.error(error);
}

export default router;
