import { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";

function Models() {
  const [models, setModels] = useState([]);
  const [brands, setBrand] = useState([]);
  const [modelData, setModelData] = useState({ name: "", brand_id: null });
  const [open, setOpen] = useState(false);

  ///////////////////////////// TOKEN ///////////////////////////////
  // const token = localStorage.getItem("accessToken");
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxNzI1OTkxOSwiZXhwIjoxNzQ4Nzk1OTE5fQ.NZApBzV3gHG4vel-wbdHS29Z9eAp13w6ChrwjHJCwuM';

  ///////////////////////////// GET MODEL ///////////////////////////
  const getModels = () => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models" )
      .then((res) => res.json())
      .then((model) => {
        setModels(model.data);
        console.log(model.data);
      });
  };

  ////////////////////////// GET BRANDS ////////////////////////////////
  const getBrands = () => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands")
      .then((res) => res.json())
      .then((brand) => {
        setBrand(brand.data);
        console.log(brand.data);
      });
  };

  useEffect(() => {
    getModels();
    getBrands();
  }, []);

  /////////////////////////////////// POST MODEL //////////////////////////////

  const createModel = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", modelData.name);
    formData.append("brand_id", modelData.brand_id);

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        getModels();
        setOpen(false);
        message.success("Successfully created");
      })
      .catch((error) => {
        message.error("Something went wrong");
        console.log(error);
      });
  };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  ///////////////////////////////// TABLE COLUMNS /////////////////////////////
  const columns = [
    {
      title: "№",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Brand Name",
      dataIndex: "brand_name",
      key: "brand_name",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
    },
  ];

  ///////////////////////////////// TABLE DATA SOURCE /////////////////////////
  const dataSource = models.map((model, index) => ({
    key: model.id,
    number: index + 1,
    brand_name: model.brand_title,
    model: model.name,
    action: (
      <>
        <Button style={{ marginRight: 10 }} type="primary">
          Edit
        </Button>
        <Button type="primary" danger>
          Delete
        </Button>
      </>
    ),
  }));

  return (
    <div>
      <div className="flex justify-between mb-[20px]">
        <h1>Model</h1>
        <Button onClick={() => setOpen(true)}>Add Modal</Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 6 }}
      />

      {/* ######################### POST MODAL  ##########################  */}
      <Modal
        title="Add Model"
        open={open}
        onOk={() => setOpen(true)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <form id="myForm" onSubmit={createModel}>
          <div className="mb-[20px]">
            <label className="block mb-[7px]">
              <span style={{ color: "red", fontSize: "15px" }}>* </span>Model
              Name
            </label>
            <input
              type="text"
              onChange={(e) =>
                setModelData({ ...modelData, name: e.target.value })
              }
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[7px]">
              <span style={{ color: "red", fontSize: "15px" }}>* </span>Model
              Name
            </label>
            <select
              onChange={(e) =>
                setModelData({ ...modelData, brand_id: e.target.value })
              }
              className="w-full p-[8px] border-2 border-[#e5e7eb] rounded"
            >
              {brands.map((brand, index) => (
                <option className="border-[#e5e7eb] rounded" key={index} value={brand.id}>
                  {brand.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button className="mr-[10px]" danger onClick={() => setOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary">Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Models;
