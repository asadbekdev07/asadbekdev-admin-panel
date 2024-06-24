import { useState, useEffect } from 'react'
import { Table, Button, Modal, message } from 'antd'

function Models() {
  const [models, setModel] = useState([])
  const [brands, setBrand] = useState([])
  const [modelData, setModelData] = useState({name: "", brand_id: null})
  const [open, setOpen] = useState(false)

  ///////////////////////////// TOKEN ///////////////////////////////
  const token = localStorage.getItem("accessToken");

  ///////////////////////////// GET MODEL ///////////////////////////
  const getModels = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/models')
    .then(res=>res.json())
    .then(model=>{
      setModel(model.data);
      console.log(model.data);
    })
  }

  ////////////////////////// GET BRANDS ////////////////////////////////
  const getBrands = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/brands')
    .then(res=>res.json())
    .then(brand=>{
      setBrand(brand.data);
      console.log(brand.data);
    })
  }

  useEffect(()=> {
    getModels();
    getBrands();
  }, [])

  /////////////////////////////////// POST MODEL //////////////////////////////

  const createModel = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', modelData.name)
    formData.append('brand_id', modelData.brand_id)

    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/models', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "POST",
      body: formData,
    })
    .then(res=>res.json())
    .then(res=>{
      getModels()
      message.success("Successfully created")
    })
    .catch(error =>{
      message.error("Something went wrong")
      console.log(error);
    })
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }


  ///////////////////////////////// TABLE COLUMNS /////////////////////////////
  const columns = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand_name',
      key: 'brand_name',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action'
    }
  ];

///////////////////////////////// TABLE DATA SOURCE /////////////////////////
const dataSource = models.map((model, index) => ({
  key: model.id,
  number: index + 1,
  brand_name: model.brand_title,
  model: model.name,
  action: (
    <>
      <Button style={{ marginRight: 10 }} type="primary">Edit</Button>
      <Button type="primary" danger>Delete</Button>
    </>
  )
}));


  return (
    <div>
      <div className='flex justify-between mb-[20px]'>
      <h1>Model</h1>
      <Button onClick={handleOpen}>Add Modal</Button>
      </div>

      <Table columns={columns} dataSource={dataSource}   pagination={{pageSize: 6}} />

      {/* ######################### POST MODAL  ##########################  */}
      <Modal title="Add Model" open={open} onOk={handleOpen} onCancel={handleClose} footer={null}>
        <form action="" onSubmit={createModel}>
          <div className='mb-[15px]'>
            <label className='block mb-[5px]'><span style={{ color: 'red', fontSize: '15px' }}>*  </span>Model Name</label>
            <input type="text"
            className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Models