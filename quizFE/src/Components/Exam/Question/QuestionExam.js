import './QuestionExam.scss';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
import { GetQuizQuestionAnswer, SubmitAnswer } from "../../../Services/QuizAPI";
import _ from 'lodash';
import Countdown, { zeroPad } from 'react-countdown';

const QuestionExam = (props) => {
    const [title, setTitle] = useState('')
    const [questionList, setQuestionList] = useState([])
    const [questionShow, setQuestionShow] = useState({})
    const [questionIndex, setQuestionIndex] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [scoreFinish, setScoreFinish] = useState(0)
    const [checkFailedPoint, setCheckFailedPoint] = useState(false)
    const [answerFinish, setAnswerFinish] = useState([])
    const [answerCurrent, setAnswerCurrent] = useState([])
    const [answerLength, setAnswerLength] = useState(0)
    const [timeUp, setTimeUp] = useState(false)
    const [timer, setTimer] = useState(Date.now() + 1000 * 60 * 60)
    const [numOfCorrect, setNumOfCorrect] = useState(0)

    const handleConfirm = () => {
        setShowConfirm(!showConfirm)
    }
    const handleNext = () => {
        if (questionIndex < questionList.length - 1) {
            setQuestionIndex(questionIndex + 1)
        }
    }
    const handlePrevious = () => {
        if (questionIndex > 0) {
            setQuestionIndex(questionIndex - 1)
        }
    }
    const handleClickIndex = (index) => {
        setQuestionIndex(index)
    }
    const handleChooseAnswer = (index) => {
        const _questionList = [...questionList];
        const currentQuestion = { ..._questionList[questionIndex] };
        const answerList = [...currentQuestion.Answers];

        if (answerList[index].correctAnswer === undefined) {
            setAnswerLength(answerLength + 1);
        }

        answerList.forEach((answer, i) => {
            answerList[i] = { ...answer, correctAnswer: i === index };
        });

        currentQuestion.Answers = answerList;
        _questionList[questionIndex] = currentQuestion;

        setQuestionList(_questionList);
    }
    const handleSubmitQuiz = async () => {
        let _questionList = [...questionList]
        let answers = _questionList.flatMap(question => question.Answers.filter(answer => answer.correctAnswer === true))
        let res = await SubmitAnswer(answers, props.quizId)
        setIsLoading(true)
        if (res) {
            if (res.error === 0) {
                setTimeUp(true)
                setScoreFinish(res.data.score)
                setCheckFailedPoint(res.data.check)
                setAnswerFinish(res.data.result.Questions)
                setQuestionIndex(0)
                setIsLoading(false)
                if (showConfirm === true) {
                    handleConfirm()
                }
                return
            }
            return
        }
    }
    const handleTimeUp = () => {
        setTimeUp(true)
        handleSubmitQuiz()
    }
    const handleTimer = ({ hours, minutes, seconds, completed }) => {
        if (hours) {
            return <span>Thời gian còn lại: <span style={{ color: '#DC3545', fontWeight: 'bold' }}>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span></span>
        }
        return <span>Thời gian còn lại: <span style={{ color: '#DC3545', fontWeight: 'bold' }}>{zeroPad(minutes)}:{zeroPad(seconds)}</span></span>
    }
    const handleGet = async (id) => {
        let res = await GetQuizQuestionAnswer(id)
        if (res && res.data) {
            setTitle(res.data.name)
            setTimeUp(false)
            setCheckFailedPoint(false)
            setAnswerFinish([])
            setAnswerCurrent([])
            setScoreFinish(0)
            setAnswerLength(0)
            setQuestionIndex(0)
            setTimer(Date.now() + 1000 * 60 * +res.data.time)
            setNumOfCorrect(res.data.numOfCorrect)
            setQuestionList(res.data.Questions)
            return
        }
        return
    }
    const handleQuestionShow = () => {
        setQuestionShow(questionList[questionIndex])
    }
    const hanldeAnswerCurrent = () => {
        let _questionList = [...questionList]
        let dataCurrent = _questionList.flatMap(question => question.Answers.filter(answer => answer.correctAnswer === true))
        setAnswerCurrent(dataCurrent)
        return
    }
    const handleRetake = () => {
        setQuestionList([])
        handleGet(props.quizId)
    }

    useEffect(() => {
        if (props.quizId !== '' && props.isStart === true) {
            handleGet(props.quizId)
        }
    }, [props.quizId, props.isStart])

    useEffect(() => {
        handleQuestionShow()
    }, [questionIndex, questionList])

    useEffect(() => {
        hanldeAnswerCurrent()
    }, [answerFinish])

    return (
        <>
            {
                questionList && questionList.length > 0 ?
                    <>
                        <div className="row mt-2">
                            <div className="col-lg-12 col-xl-4 mt-2 mb-2">
                                <div className='right bg-right'>
                                    <div className='title-right'>
                                        <div className='color-title'>Số lượng câu hỏi: <span className='text-danger fw-bold'>{questionList.length}</span> | Yêu cầu làm đúng <span className='text-danger fw-bold'>{numOfCorrect}/{questionList.length}</span></div>
                                        <div className='color-title'>Câu điểm liệt là câu có dấu (<strong className='text-danger'>*</strong>) trên câu hỏi.</div>
                                    </div>
                                    <div className='choose row row-cols-auto justify-content-center'>
                                        {
                                            answerFinish && answerFinish.length > 0 && timeUp === true ?
                                                answerFinish.map((item, index) => {
                                                    return (
                                                        <div key={index}
                                                            className={
                                                                item.Answers.some(item2 => answerCurrent.find(item3 => item2.id === item3.id))
                                                                    ?
                                                                    item.Answers.find((item2) => {
                                                                        if (item2.correctAnswer === true && answerCurrent.find(item3 => item2.id === item3.id)) {
                                                                            return true
                                                                        }
                                                                        return false
                                                                    })
                                                                        ? 'box true col'
                                                                        : 'box false col'
                                                                    : 'box notAnswer col'
                                                            }
                                                            onClick={() => { handleClickIndex(index) }}>{index + 1}
                                                        </div>
                                                    )
                                                })
                                                :
                                                questionList && questionList.length > 0 ?
                                                    questionList.map((item, index) => {
                                                        return (
                                                            <div key={index}
                                                                className={
                                                                    item.Answers.find((item2, index2) => {
                                                                        if (item2.correctAnswer) {
                                                                            return true
                                                                        }
                                                                        return false
                                                                    })
                                                                        ? 'box active col'
                                                                        : 'box default col'
                                                                }
                                                                onClick={() => { handleClickIndex(index) }}>{index + 1}
                                                            </div>
                                                        )
                                                    }) : <></>
                                        }
                                    </div>
                                </div>
                                {
                                    answerFinish && answerFinish.length > 0 && timeUp === true ?
                                        <div className='right-3 bg-right'>
                                            <div className='content-r3'>
                                                <div className='title-r3'>
                                                    <span>KẾT QUẢ BÀI THI</span>
                                                </div>
                                                <div className='mt-2'>
                                                    {
                                                        scoreFinish < numOfCorrect ?
                                                            <>
                                                                <span>Kết quả: </span><span className='text-false'>KHÔNG ĐẠT</span>
                                                            </>
                                                            :
                                                            checkFailedPoint === true
                                                                ?
                                                                <>
                                                                    <span>Kết quả: </span><span className='text-false'>KHÔNG ĐẠT - vì sai câu điểm liệt</span>
                                                                </>
                                                                :
                                                                <>
                                                                    <span>Kết quả: </span><span className='text-true'>ĐẠT</span>
                                                                </>
                                                    }
                                                </div>
                                                <div className=''>
                                                    <span>Đề số: <span className='text-primary fw-medium'>{title ? title : ''}</span></span>
                                                </div>
                                                <div>
                                                    <span>Số câu đúng: </span><span className='text-true'>{scoreFinish}</span> | <span>Số câu sai: </span><span className='text-false'>{answerFinish.length - scoreFinish}</span>
                                                </div>
                                                <div className='col'>
                                                    <hr />
                                                </div>
                                                <div>
                                                    <span>Chưa trả lời: </span><span className='text-notAnswer'>Tô màu vàng</span>
                                                </div>
                                                <div>
                                                    <span>Đáp án sai: </span><span className='text-false'>Tô màu đỏ</span>
                                                </div>
                                                <div>
                                                    <span>Đáp án đúng: </span><span className='text-true'>Tô màu xanh</span>
                                                </div>
                                                <div className='col'>
                                                    <hr />
                                                </div>
                                                <div className='submit mt-2'>
                                                    <button className='' onClick={() => { handleRetake() }}>Thi lại</button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className='right-2 bg-right'>
                                            <div className='time'>
                                                <Countdown
                                                    date={timer}
                                                    renderer={handleTimer}
                                                    onComplete={handleTimeUp}
                                                />
                                            </div>
                                            <div className='submit'>
                                                <button className='' onClick={() => { handleConfirm() }}>HOÀN TẤT BÀI THI</button>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="col-lg-12 col-xl-8 mt-2">
                                <div className='left'>
                                    <div className="nameQ">
                                        <span className="fw-bolder strongQ">Câu hỏi {questionIndex + 1}: </span>
                                        {
                                            questionShow && questionShow.failedPoint === true
                                                ?
                                                <span>
                                                    <strong className='text-danger'>*</strong> {questionShow ? questionShow.name : ''}
                                                </span>
                                                :
                                                <span>
                                                    {questionShow ? questionShow.name : ''}
                                                </span>
                                        }
                                    </div>
                                    <div className='row justify-content-center'>
                                        <div className='col-lg-10 col-12 imgQ'>
                                            {
                                                questionShow && questionShow.image ?
                                                    <img src={process.env.REACT_APP_IMAGE_BASE_URL + questionShow.image} width={'90%'} alt={''} />
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='row answerList'>
                                        {
                                            questionShow && questionShow.Answers ? questionShow.Answers.map((item, index) => {
                                                return (
                                                    <div className='col-12' style={{ marginBottom: '14px' }} key={index}>
                                                        <div className="form-check">
                                                            {
                                                                timeUp === true && answerFinish && answerFinish.length > 0 && answerFinish[questionIndex].Answers[index]
                                                                    ?
                                                                    <>
                                                                        <input className="form-check-input checkA" type="radio" value={item.description}
                                                                            id={`check-${index}`} name={`answer${questionIndex}`}
                                                                            checked={item.correctAnswer ? item.correctAnswer : false}
                                                                            disabled={true}
                                                                        />
                                                                        {
                                                                            answerFinish[questionIndex].Answers[index].correctAnswer === true
                                                                                ?
                                                                                <label className="form-check-label checkA success-text"
                                                                                    htmlFor={`check-${index}`}>
                                                                                    {item.description} <i className="fa fa-check"></i>
                                                                                </label>
                                                                                :
                                                                                <>
                                                                                    {
                                                                                        item.correctAnswer === true
                                                                                            ?
                                                                                            <label className="form-check-label checkA danger-text"
                                                                                                htmlFor={`check-${index}`}>
                                                                                                {item.description} <i className="fa fa-times"></i>
                                                                                            </label>
                                                                                            :
                                                                                            <label className="form-check-label checkA"
                                                                                                htmlFor={`check-${index}`}>
                                                                                                {item.description}
                                                                                            </label>
                                                                                    }
                                                                                </>

                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <input className="form-check-input checkA" type="radio" value={item.description}
                                                                            id={`check-${index}`} name={`answer${questionIndex}`}
                                                                            onChange={() => { handleChooseAnswer(index) }}
                                                                            checked={item.correctAnswer ? item.correctAnswer : false}
                                                                        />
                                                                        <label className="form-check-label checkA"
                                                                            htmlFor={`check-${index}`}>
                                                                            <strong className='strongQ'>{index + 1}.</strong> {item.description}
                                                                        </label>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }) : <></>
                                        }
                                    </div>
                                    <div className='pagination'>
                                        <div className=''>
                                            <button className='leftBtn' onClick={() => { handlePrevious() }}>Câu trước</button>
                                        </div>
                                        <div className=''>
                                            <button className='rightBtn' onClick={() => { handleNext() }}>Câu sau</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal
                            show={showConfirm}
                            onHide={handleConfirm}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Bạn có chắc muốn nộp bài?
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='text-center'>
                                <div className='fst-italic text-danger' style={{ fontSize: '16.3px' }}>
                                    <i className="fa fa-exclamation-triangle"></i> Hãy trả lời tất cả câu hỏi để đạt được kết quả tốt nhất.
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className='d-flex'>
                                    <div className=''>
                                        <button onClick={handleConfirm} className='btn btn-secondary mx-1' style={{ fontSize: '18px' }}>Đóng</button>
                                    </div>
                                    <div className=''>
                                        {
                                            isLoading === false ?
                                                <button onClick={handleSubmitQuiz} className='btn btn-success' style={{ fontSize: '18px' }}>Nộp bài</button>
                                                :
                                                <button className='btn btn-success' style={{ fontSize: '18px' }}>
                                                    <span>Đang nộp bài thi</span>
                                                    <div className="spinner-border" role="status" style={{ marginLeft: '8px', width: '18px', height: '18px' }}>
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </button>
                                        }
                                    </div>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    </>
                    :
                    <div className='d-flex justify-content-center load-background'>
                        <div className='text-center' style={{ color: '#38A6F3' }}>
                            <div className="spinner-border" role="status" style={{ height: '54px', width: '54px' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className='mt-2 fst-italic fw-medium' style={{ fontSize: '19px' }}>
                                Đang khởi tạo bài thi, vui lòng chờ trong giây lát.
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default QuestionExam;