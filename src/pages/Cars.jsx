// import { useEffect, useState } from "react"

// function Cars() {

//   const APICARS = 'https://autoapi.dezinfeksiyatashkent.uz/api/categories/'
//   const urlImages = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/'

//   const [cars, setCars] = useState([])
//   const [createCar, setCreateCar] = useState(false)
//   const [editCarModal, setEditCarModal] = useState(false)
//   const [editCarId, setEditeCarId] = useState('')

//   // Fetching all car's information
//   useEffect(() => {
//     fetch(APICARS).then((res) => res.json()).then((data) => {
//       console.log(data.data)
//       setCars(data.data)
//     }).catch((err) => console.log(err))
//   }, [])

//   // Creating car to use adding or editing
//   const [car, setCar] = useState({})

//   // Adding new car
//   const addCar = (e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)

//     formData.append('name_en', car.name_en)
//     formData.append('name_ru', car.name_ru)
//     formData.append('images', car.images)

//     fetch(APICARS, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//       },
//       body: formData
//     })
//   }

//   // Deleteing car
//   const deleteCar = (e) => {
//     const newCars = cars.filter((car) => {
//       if (car.id !== e.target.id) {
//         return car
//       }
//     })

//     fetch(`${APICARS}${e.target.id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//       }
//     }).then((res) => res.json()).then((data) => {
//       if (data.success == true) {
//         setCars(newCars)
//       }
//     }).catch((err) => console.log(err))
//   }

//   // Editing car
//   const editCar = (e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)

//     formData.append('name_en', car.name_en)
//     formData.append('name_ru', car.name_ru)
//     formData.append('images', car.images)

//     fetch(`${APICARS}${editCarId}`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//       },
//       body: formData
//     })
//   }

//   return (
//     <div>
//       <div className="flex justify-between font-semibold py-3 items-center">
//         <span className="text-xl">Cars</span>
//         <button className="bg-green-300 rounded px-5 py-1" onClick={() => {
//           setCreateCar(true)
//         }}>Add Car</button>
//       </div>

//       {/* Adding new car */}
//       <div id="add_car_modal" className={`${createCar ? '' : 'hidden'} p-5 bg-gray-300/20 backdrop-blur fixed top-0 left-0 right-0 bottom-0 z-[100]`} onClick={(e) => {
//             if (e.target == document.getElementById('add_car_modal')) {
//               setCreateCar(false)
//             }
//           }}>
//         <form onSubmit={(e) => {
//             addCar(e)
//             setCreateCar(false)
//           }} className="flex flex-col w-[500px] bg-gray-300 p-5 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
//           <input type="text" placeholder="name_uz" required onChange={(e) => {
//             setCar({...car, name_en: e.target.value})
//           }} className="border-2 border-cyan-700 my-5 p-1"/>
//           <input type="text" placeholder="name_ru" required onChange={(e) => {
//             setCar({...car, name_ru: e.target.value})
//           }} className="border-2 border-cyan-700 my-5 p-1"/>
//           <input type="file" required onChange={(e) => {
//             setCar({...car, images: e.target.files[0]})
//           }} className="border-2 border-cyan-700 my-5"/>
//           <button type="submit" className="border-2 border-cyan-700 my-5 bg-green-400">ADD</button>
//         </form>
//       </div>

//       {/* Editing car */}
//       <div id="edit_car_modal" className={`${editCarModal ? '' : 'hidden'} p-5 bg-gray-300/20 backdrop-blur fixed top-0 left-0 right-0 bottom-0 z-[100]`} onClick={(e) => {
//             if (e.target == document.getElementById('edit_car_modal')) {
//               setEditCarModal(false)
//             }
//           }}>
//         <form onSubmit={(e) => {
//             editCar(e)
//             setEditCarModal(false)
//           }} className="flex flex-col w-[500px] bg-gray-300 p-5 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
//           <input type="text" placeholder="name_uz" required onChange={(e) => {
//             setCar({...car, name_en: e.target.value})
//           }} className="border-2 border-cyan-700 my-5 p-1"/>
//           <input type="text" placeholder="name_ru" required value={car.name_ru} onChange={(e) => {
//             setCar({...car, name_ru: e.target.value})
//           }} className="border-2 border-cyan-700 my-5 p-1"/>
//           <input type="file" required onChange={(e) => {
//             setCar({...car, images: e.target.files[0]})
//           }} className="border-2 border-cyan-700 my-5"/>
//           <button type="submit" className="border-2 border-cyan-700 my-5 bg-green-400">EDIT</button>
//         </form>
//       </div>

//       {/* Table of information */}
//       <table className="border-separate border w-full">
//         <thead>
//           <tr className="bg-cyan-100">
//             <th className="border px-5 py-1">Color</th>
//             <th className="border px-5 py-1">Brand</th>
//             <th className="border px-5 py-1">Location</th>
//             <th className="border px-5 py-1">Model</th>
//             <th className="border px-5 py-1">Category</th>
//             <th className="border px-5 py-1">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cars && cars.map((car, i) => {
//             return (
//               <tr key={i}>
//                 <td className="border px-5 py-1">{car.name_en}</td>
//                 <td className="border px-5 py-1"><img src={`${urlImages}${car.image_src}`} alt="image" width={100}/></td>
//                 <td></td>
//                 <td></td>
//                 <td></td>
//                 <td>
//                   <button id={car.id} className="bg-red-400 rounded mx-1 p-1 w-[80px]" onClick={deleteCar}>Delete</button>
//                   <button id={car.id} className="bg-blue-400 rounded mx-1 p-1 w-[80px]" onClick={(e) => {
//                     setEditeCarId(e.target.id)
//                     setEditCarModal(true)
//                   }}>Edit</button>
//                 </td>
//               </tr>
//             )
//           })}
//         </tbody>
//         <tfoot></tfoot>
//       </table>
//     </div>
//   )
// }

// export default Cars

import { useEffect, useState } from "react"
import { Modal, Button, message, Table, Popover } from 'antd';

function Cars() {
  const [cars, setCars] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [id, setId] = useState(null);
  const [data, setData] = useState({ brand_id: '', model_id: '', city_id: '', color: "", images: null });


  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';
  const token = localStorage.getItem("accessToken")

  const getCars = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cars')
      .then((res) => res.json())
      .then((cars) => {
        setCars(cars.data);
        localStorage.setItem("accessToken", data?.data?.tokens?.accessToken?.token)
      })
      .catch((error) => {
        console.error(error);
      });
  };

    // CREATE FORM
    const createForm = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('brand', data.brand_id);
      formData.append('model', data.model_id);
      formData.append('city', data.city_id);
      formData.append('images', data.images);
      formData.append('color', data.color);
      fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            getCars();
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
      getCars();
    }, []);


    const handleModalOpen = () => {
      setOpenModal(true);
    };

    const handleModalClose = () => {
      setOpenModal(false);
      resetFormData();
    };

    const hidePopover = () => {
      setOpenPopover(null);
    };

    const handlePopoverOpenChange = (newOpen, id) => {
      setOpenPopover(newOpen ? id : null);
    };

    const handleImageChange = (e) => {
      setData({ ...data, images: e.target.files[0] });
    };

    const handleEditModalClose = () => {
      setOpenEditModal(false);
      resetFormData();
    };

    const handleEditModalOpen = (item) => {
      setId(item.id);
      setOpenEditModal(true);
      setData({ name: item.name, slug: item.slug, text: item.text, images: item.image_src });
    };


    const resetFormData = () => {
      setData({ brand_id: '', model_id: '', city_id: '', color: "", images: null });
    };

    const columns = [
      {
        title: 'Brand',
        dataIndex: 'brand',
        key: 'brand',
      },
      {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: 'Images',
        dataIndex: 'images',
        key: 'images',
        render: (text, record) => (
          <img className="w-[50px]" src={`${urlImage}${record.image_src}`} alt="Error" />
        ),
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <>
            <Button type="primary" onClick={() => handleEditModalOpen(record)}>Edit</Button>
            <Popover
              content={<Button type="primary" danger onClick={() => handleDelete(record.id)}>Confirm Delete</Button>}
              title="Are you sure?"
              trigger="click"
              open={openPopover === record.id}
              onOpenChange={(newOpen) => handlePopoverOpenChange(newOpen, record.id)}
            >
              <Button type="primary" danger>Delete</Button>
            </Popover>
          </>
        ),
      },
    ];

    const dataSource = cars.map((location) => ({
      key: location.id,
      ...location,
    }));

  return (
    <div>

      <div className="relative">
        <Button className="rounded-md bg-[rgb(37, 99, 235)] hover:bg-blue-600 py-1 px-3  absolute top-3 right-4 z-20" onClick={handleModalOpen}>
          Add a Category
        </Button>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
      </div>

      <Modal
        title="Add Cars"
        open={openModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={createForm}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Brand</label>
            <input
              type="search"
              value={data.brand_id}
              onChange={(e) => setData({ ...data, brand_id: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Model</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
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
              onChange={handleImageChange}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Add Location
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Cars