import React, { useContext, useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { getToken, publicRequest, userRequest } from "../../requestMethods";
import { AuthContext } from "../context/AuthContex";
import { timeAgo } from "../../utils";
import { Button, Modal } from 'antd';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderSubTotal,setNewOrderSubTotal] = useState(null)
  const [loading, setLoading] = useState(false);
  const [confirmLoading,setConfirmLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const { user,dispatch } = useContext(AuthContext);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    getOrders(page)
  };
  const getOrders = async (page) => {
    try {
      setLoading(true);
      setOrders([])
      const res = await publicRequest.get(`/get-orders/${user._id}?page=${page}`,{ headers: {token: `Bearer ${user?.accestoken}`}});
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async(order) => {
    setLoading(true)
    const res = await userRequest.delete(`/delete-order/${order?._id}`)
    setCurrentPage(1)
    getOrders(1)
  };
  useEffect(() => {
    if(user?.accestoken){
      getOrders(1)
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true)
    const res = await userRequest.post("/add-order", {user_id: user?._id, sub_total: newOrderSubTotal, phone_number: user?.phone_number})
    setConfirmLoading(false)
    getOrders(1)
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleLogout = ()=>{
    dispatch({type: "LOGOUT"})
  }
console.log(newOrderSubTotal)
  return (
    <div className="container d-flex flex-column">
      <button className="btn btn-danger" style={{width: '120px', position: 'absolute', right: '140px', top: '50px'}} onClick={()=>handleLogout()}>Logout</button>
      <div style={{alignSelf: 'center'}} className="mb-3">
      <Button type="primary" onClick={showModal}>
        Add Order
      </Button>
      <Modal title="New Order" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{disabled: newOrderSubTotal == null? true: false}} confirmLoading={confirmLoading}>
        <label className="text-dark">Sub Total: </label>
        <input className="p-1 mx-2" type="number" required onChange={(e)=>setNewOrderSubTotal(e.target.value)}/>
      </Modal>
      </div>
      <div className="table-responsive">
        <table className="table">
          <tr className="bg-dark">
            <th scope="col" className="text-white">
              Sno
            </th>
            <th scope="col" className="text-white">
              Id
            </th>
            <th scope="col" className="text-white">
              Sub Total
            </th>
            <th scope="col" className="text-white">
              Created At
            </th>
            <th scope="col" className="text-white">
              Actions
            </th>
          </tr>
          <tbody>
            {orders.length > 0 &&
              orders.map((order, index) => (
                <tr key={order?._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{order?._id}</td>
                  <td>{order?.sub_total}</td>
                  <td>{timeAgo(new Date(order?.createdAt))}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(order)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <ResponsivePagination
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
