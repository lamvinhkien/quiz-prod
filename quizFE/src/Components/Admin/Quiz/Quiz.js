import { useEffect, useState } from 'react';
import { GetAllQuizPagination, GetAllCategory } from '../../../Services/QuizAPI'
import ModalAddQuiz from './ModalAddQuiz';
import ModalCategory from './ModalCategory';
import { useNavigate } from 'react-router-dom';
import './Quiz.scss';
import ReactPaginate from "react-paginate";

const Quiz = () => {
    const navigate = useNavigate()
    const [quizList, setQuizList] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const [listCategory, setListCategory] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [condition, setCondition] = useState({})

    const handleGetAllQuiz = async () => {
        let res = await GetAllQuizPagination(page, limit, condition)
        if (res && res.data) {
            setQuizList(res.data)
            setTotalPage(res.totalPage)
            setOffset(res.offset)
        }
    }
    const handleShowCreate = () => {
        setShowCreate(!showCreate)
    }
    const handleShowCategory = () => {
        setShowCategory(!showCategory)
    }
    const handleGetAllCategory = async () => {
        let res = await GetAllCategory()
        if (res && res.data) {
            setListCategory(res.data)
        }
    }
    const redirectToQuizId = async (id) => {
        navigate('/admin/quiz/' + id)
    }
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleRefresh = () => {
        handleGetAllQuiz()
    }
    const handleChangeCondition = (value) => {
        setPage(1)
        setCondition(value)
    }

    useEffect(() => {
        handleGetAllQuiz()
    }, [page, condition])

    useEffect(() => {
        handleGetAllCategory()
    }, [])

    return (
        <div className='container'>
            <div className="Quiz-box">
                <div className="row align-items-center">
                    <div className='col-12 col-lg-3'>
                        <label className='fs-4 fw-bold title-color text-nowrap'><i className="fa fa-list-alt"></i> Danh sách bài thi</label>
                    </div>
                    <div className='col-12 col-lg-9'>
                        <div className="row">
                            <div className='col-12 col-lg-5 mt-2 mt-lg-0'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="text-nowrap mx-2">Sắp xếp:</label>
                                    <select className="form-select" onChange={(event) => { handleChangeCondition(event.target.value) }}>
                                        <option value=''>Tất cả</option>
                                        {listCategory && listCategory.length > 0 ? listCategory.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        }) :
                                            <option value=''>Không có danh mục bài thi</option>
                                        }

                                    </select>
                                </div>
                            </div>
                            <div className='col-12 col-lg-2 mt-2 mt-lg-0'>
                                <button className='btn btn-primary w-100' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Làm mới</button>
                            </div>
                            <div className='col-12 col-lg-2 mt-2 mt-lg-0'>
                                <button className='btn btn-success w-100' onClick={() => { handleShowCreate() }}><i className="fa fa-plus-circle"></i> Thêm bài thi</button>
                            </div>
                            <div className='col-12 col-lg-3 mt-2 mt-lg-0'>
                                <button className='btn btn-warning w-100' onClick={() => { handleShowCategory() }}><i className="fa fa-list-ul"></i> Quản lý danh mục</button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div style={{ minHeight: '390px' }} className='table-responsive text-nowrap'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên bài thi</th>
                                <th>Danh mục</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizList.length > 0 ? quizList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ width: '80px' }}>{index + 1 + offset}</td>
                                        <td className="hiddenTD">{item.name}</td>
                                        <td>{item.Category ? item.Category.name : ''}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => { redirectToQuizId(item.id) }}><i className="fa fa-pencil-square-o"></i></button>
                                        </td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td colSpan={6} className='text-center fst-italic'><span>Không có bài thi nào.....</span></td>
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

            <ModalAddQuiz
                show={showCreate}
                handleShow={handleShowCreate}
                fetch={handleGetAllQuiz}
                listCategory={listCategory}
            />

            <ModalCategory
                show={showCategory}
                handleShow={handleShowCategory}
            />
        </div>
    )
}

export default Quiz;