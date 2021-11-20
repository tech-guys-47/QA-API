const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/QA-API')
.then(() => console.log('Connected'))
.catch(() => console.log('Could not connect'));

let questionSchema = mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: Number,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpful: Number
});

let Question = mongoose.model('Question', questionSchema, 'questions')

let getOne = () => {
  return Answer.findOne({id: '1'}).then(response => response)
}

let answerSchema = mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Number,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number,
  photos: Array
});

let Answer = mongoose.model('Answer', answerSchema, 'Combined')

module.exports.questionModels = {
  getQuestions: (productId) => {
    return Question.find({ product_id: productId, reported: false })
      .then(results => results)
      .catch(err => {
        console.log('failed to retrieve questions: ', err);
        return err;
      });
  },

  postQuestion: (questionData) => {
    return Question.findOne().sort({ id: -1 })
      .then(results => {
        questionData["id"] = results.id + 1;
        let newQuestion = new Question(questionData);
        return newQuestion.save()
          .then(results => results)
          .catch(err => {
            console.log('failed to save question: ', err);
            return err;
          });
      })
      .catch(err => {
        console.log('failed to get latest document: ', err);
        return err;
      })
  },

  putHelpful: (questionId) => {
    return Question.findOneAndUpdate({ id: questionId }, { $inc: { helpful: 1 } })
      .then(results => results)
      .catch(err => {
        console.log('failed to update helpful: ', err);
        return err;
      });
  },

  putReported: (questionId) => {
    return Question.findOneAndUpdate({ id: questionId }, { reported: true })
      .then(results => results)
      .catch(err => {
        console.log('failed to report the question: ', err);
        return err;
      });
  }
};

module.exports.answerFunctions  = {
  getAllAnswers: (question_id) => {
    return Answer.find({ question_id: question_id, reported: false })
      .then(results => results)
      .catch(err => {
        console.log('Failed to retrieve answers for question: ' + question_id);
        return err;
      });
  },
  postAnswer: (answerData) => {
  }
}
/* module.exports.getOne = getOne; */