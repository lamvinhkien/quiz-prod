import axios from '../Setup/axiosSetup';

const GetAllQuiz = (condition) => {
    let res = axios.post('/getAll-quiz', { condition: condition })
    return res;
}

const GetAllQuizPagination = (page, limit, condition) => {
    let res = axios.post(`/getAll-quiz-pagination-Admin?page=${page}&limit=${limit}`, { condition: condition })
    return res;
}

const GetQuizQuestionAnswer = (idQuiz) => {
    let res = axios.post('/getQuiz-Question-Answer', { id: idQuiz })
    return res;
}

const GetQuizAdmin = (id) => {
    let res = axios.post('/getAll-quiz-Admin', { id: id })
    return res;
}

const GetAllCategory = () => {
    let res = axios.get('/getAll-category')
    return res;
}

const CreateCategory = (name) => {
    let res = axios.post('/create-category', { name: name })
    return res;
}

const UpdateCategory = (id, name) => {
    let res = axios.post('/update-category', { id: id, name: name })
    return res;
}

const DeleteCategory = (id) => {
    let res = axios.post('/delete-category', { id: id })
    return res;
}

const GetCategoryPagination = (page, limit) => {
    let res = axios.get(`/getAll-category-pagination?page=${page}&limit=${limit}`)
    return res;
}

const GetQuestionAnswerAdmin = (idQuiz, page, limit, condition) => {
    let res = axios.post(`/getQuiz-Question-Answer-Admin?page=${page}&limit=${limit}`, { id: idQuiz, condition: condition })
    return res;
}

const CreateQuiz = (formData) => {
    let res = axios.post('/create-quiz', formData)
    return res;
}

const UpdateQuiz = (formData) => {
    let res = axios.post('/update-quiz', formData)
    return res;
}

const DeleteQuiz = (idQuiz) => {
    let res = axios.post('/delete-quiz', { id: idQuiz })
    return res;
}

const CreateQuestionAnswer = (formData) => {
    let res = axios.post('/createQuestion-AndAnswer', formData)
    return res;
}

const UpdateQuestionAnswer = (formData) => {
    let res = axios.post('/updateQuestion-AndAnswer', formData)
    return res;
}

const DeleteQuestion = (idQuestion) => {
    let res = axios.post('/delete-question', { id: idQuestion })
    return res;
}

const SubmitAnswer = (listIdAnswer, idQuiz) => {
    let res = axios.post('/submit-answer', { listIdAnswer: listIdAnswer, id: idQuiz })
    return res;
}

export {
    GetAllQuiz, CreateQuiz, UpdateQuiz, DeleteQuiz,
    CreateQuestionAnswer, UpdateQuestionAnswer, DeleteQuestion, GetQuizQuestionAnswer, SubmitAnswer,
    GetQuizAdmin, GetQuestionAnswerAdmin, GetAllCategory, GetAllQuizPagination, GetCategoryPagination,
    CreateCategory, UpdateCategory, DeleteCategory
}