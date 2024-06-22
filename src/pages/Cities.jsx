import { Modal, Popover, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

function Cities() {
  const [cities, setCities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [id, setId] = useState(null);
  const [data, setData] = useState({ name: '', text: '', images: null });

  const hidePopover = () => {
    setOpenPopover(null);
  };

  const handlePopoverOpenChange = (newOpen, id) => {
    setOpenPopover(newOpen ? id : null);
  };

  const handleImageChange = (e) => {
    setData({ ...data, images: e.target.files[0] });
  };

  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxNzI1OTkxOSwiZXhwIjoxNzQ4Nzk1OTE5fQ.NZApBzV3gHG4vel-wbdHS29Z9eAp13w6ChrwjHJCwuM';

  const getCity = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities')
      .then((res) => res.json())
      .then((category) => {
        setCities(category.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('images', data.images);
    formData.append('text', data.text);
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getCity();
          handleModalClose();
        } else {
          message.error('Error adding city');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Error adding city');
      });
  };

  useEffect(() => {
    getCity();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    resetFormData();
  };

  const handleEditModalOpen = (item) => {
    setId(item.id);
    setOpenEditModal(true);
    setData({ name: item.name, text: item.text, images: item.image_src });
  };

  const editCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('text', data.text);
    formData.append('images', data.images);
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          message.success('City updated successfully');
          getCity();
          handleEditModalClose();
          resetFormData();
        } else {
          message.error('Error updating city');
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Error updating city');
      });
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    resetFormData();
  };

  const handleDelete = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        getCity();
        hidePopover();
        message.success('City deleted successfully');
      })
      .catch((error) => {
        console.error(error);
        message.error('Error deleting city');
      });
  };

  const resetFormData = () => {
    setData({ name: '', text: '', images: null });
  };

  return (
    <div>
      <div className="flex justify-between mb-[20px]">
        <h2 className="text-3xl font-bold">Cities</h2>
        <button className="text-2xl text-white bg bg-[#1677ff] p-[7px_15px] rounded-[8px]" onClick={handleModalOpen}>Add City</button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="w-15 p-[16px_16px]">Name</th>
            <th className="w-30 p-[16px_16px]">Images</th>
            <th className="w-15 p-[16px_16px]">Text</th>
            <th className="w-25 p-[16px_16px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities && cities.map((item, index) => (
            <tr key={index}>
              <td className="p-[16px_16px] border-b border-[#e5e7eb]">{item.name}</td>
              <td className="p-[16px_16px] border-b border-[#e5e7eb]">
                <img className="w-[50px]" src={`${urlImage}${item.image_src}`} alt="" />
              </td>
              <td className="p-[16px_16px] border-b border-[#e5e7eb]">{item.text}</td>
              <td className="p-[16px_16px] border-b border-[#e5e7eb]">
                <Popover
                  placement="left"
                  content={
                    <div>
                      <p>Are you sure you want to delete?</p>
                      <div className="flex justify-end mt-[10px]">
                        <Button size="small" onClick={hidePopover} className="mr-[10px]">
                          No
                        </Button>
                        <Button type="primary" size="small" onClick={() => handleDelete(item.id)}>
                          Yes
                        </Button>
                      </div>
                    </div>
                  }
                  title={item.name}
                  trigger="click"
                  open={openPopover === index}
                  onOpenChange={(newOpen) => handlePopoverOpenChange(newOpen, index)}
                >
                  <Button className="mr-[10px] text-white bg bg-[#ff4d4f] p-[8px_18px] rounded-[8px]">
                    <span>
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                      </svg>
                    </span>
                  </Button>
                </Popover>
                <button className="text-white bg bg-[#1677ff] p-[8px_18px] rounded-[8px]" onClick={() => handleEditModalOpen(item)}>
                  <span>
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                    </svg>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Add City"
        open={openModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={createForm}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Text</label>
            <input
              type="text"
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Image</label>
            <input
              type="file"
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, images: e.target.files[0] })}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Add City
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL  */}

      <Modal
        title="Edit City"
        open={openEditModal}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <form onSubmit={editCategory}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name</label>
            <input
              type="text"
              value={data.name}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Text</label>
            <input
              type="text"
              value={data.text}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, text: e.target.value })}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Image</label>
            <input
              type="file"
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={handleImageChange}
            />
            {data.images && (
              <img className="w-[100px] mt-[15px]" src={`${urlImage}${data.images}`} alt="Selected Image" />
            )}
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Edit City
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default Cities;
