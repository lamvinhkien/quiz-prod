import { useEffect, useState } from "react";
import { GetQuestionAnswerAdmin, GetQuizAdmin } from "../../../Services/QuizAPI";
import { useParams } from "react-router-dom";
import ModalAddQuestion from "./ModalAddQuestion";
import ModalEditQuestion from "./ModalEditQuestion";
import QuizInfo from "./QuizInfo";
import './Question.scss';
import ReactPaginate from "react-paginate";
import noneimg from '../../../Assets/noneimg.png';

const Question = () => {
    const params = useParams();
    const [questionList, setQuestionList] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [dataEdit, setDataEdit] = useState({})
    const [dataQuiz, setDataQuiz] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [condition, setCondition] = useState({})

    const handleShowCreate = () => {
        setShowCreate(!showCreate)
    }
    const handleShowEdit = (id) => {
        setShowEdit(true)
        let data = questionList.find(item => item.id === id)
        if (data) {
            setDataEdit(data)
        }
    }
    const handleCloseEdit = () => {
        setShowEdit(false)
        setDataEdit([])
    }
    const getQuestionAnswerAdmin = async () => {
        let res = await GetQuestionAnswerAdmin(params.id, page, limit, condition)
        if (res) {
            setQuestionList(res.data)
            setTotalPage(res.totalPage)
            setOffset(res.offset)
        }
    }
    const getQuiz = async () => {
        let res = await GetQuizAdmin(params.id)
        if (res && res.data) {
            setDataQuiz(res.data)
        }
    }
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleChangeCondition = (event) => {
        setPage(1)
        let parsedCondition = JSON.parse(event)
        setCondition(parsedCondition)
    }
    const handleRefresh = () => {
        getQuestionAnswerAdmin()
    }

    useEffect(() => {
        if (params.id) {
            getQuiz()
        }
    }, [params.id])

    useEffect(() => {
        if (params.id && page && condition) {
            getQuestionAnswerAdmin()
        }
    }, [params.id, page, condition])

    return (
        <div className='container'>
            <div className="row">
                <QuizInfo
                    data={dataQuiz}
                />
            </div>
            <div className="Question-box">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-4">
                        <label className='fs-4 fw-bold title-color'><i className="fa fa-list-alt"></i> Danh sách câu hỏi</label>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="row">
                            <div className="col-12 col-lg-5 mt-2 mt-lg-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="text-nowrap mx-2">Sắp xếp:</label>
                                    <select className="form-select"
                                        onChange={(event) => { handleChangeCondition(event.target.value) }}>
                                        <option value={JSON.stringify({})}>Tất cả</option>
                                        <option value={JSON.stringify({ image: { operator: 'ne', value: '' } })}>Có hình ảnh</option>
                                        <option value={JSON.stringify({ image: { operator: 'eq', value: '' } })}>Không có hình ảnh</option>
                                        <option value={JSON.stringify({ failedPoint: { operator: 'eq', value: 1 } })}>Câu điểm liệt</option>
                                        <option value={JSON.stringify({ failedPoint: { operator: 'eq', value: 0 } })}>Câu không điểm liệt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3 mt-2 mt-lg-0">
                                <button className='btn btn-primary w-100' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Làm mới</button>

                            </div>
                            <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                                <button className='btn btn-success w-100' onClick={() => { handleShowCreate() }}><i className="fa fa-plus-circle"></i> Thêm câu hỏi</button>

                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div style={{ minHeight: '408px' }} className="table-responsive text-nowrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên câu hỏi</th>
                                <th>Câu điểm liệt</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList.length > 0 ? questionList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ width: '50px' }}>{index + 1 + offset}</td>
                                        <td style={{ width: '150px', height: '70px' }}>
                                            <img src={item.image !== '' ? process.env.REACT_APP_IMAGE_BASE_URL + item.image : noneimg} alt={index} width={'100%'} height={'100%'} />
                                        </td>
                                        <td className="hiddenTD">{item.name}</td>
                                        <td>{item.failedPoint ? 'Có' : 'Không'}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => { handleShowEdit(item.id) }}><i className="fa fa-pencil-square-o"></i></button>
                                        </td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td colSpan={5} className='text-center fst-italic'><span>Không có câu hỏi nào.....</span></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-1">
                    {
                        totalPage > 0 &&
                        <ReactPaginate
                            nextLabel="Sau >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPage}
                            previousLabel="< Trước"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                            forcePage={page - 1}
                        />
                    }
                </div>
            </div>

            <ModalAddQuestion
                show={showCreate}
                handleShow={handleShowCreate}
                fetch={getQuestionAnswerAdmin}
            />

            <ModalEditQuestion
                show={showEdit}
                handleShow={handleShowEdit}
                handleClose={handleCloseEdit}
                data={dataEdit}
                fetch={getQuestionAnswerAdmin}
            />
        </div>
    )
}

export default Question;