import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import ImgsViewer from "react-images-viewer";
import ErrorBoundary from '../../../helper/ErrorBoundary';
import { HotelDetailsMain, ViewHotelButton } from '../wrapper/HotelListStyle';
import { AiFillRightCircle } from 'react-icons/ai';
import { days_between } from '../../../helper/ConvertFunctions';

export default function HotelDetails({ hotel, search, areas, selectedRoomsList }) {
    const history = useNavigate();
    const [isHotelImgOpen, setisHotelImgOpen] = useState(false);
    const [isRoomImgOpen, setisRoomImgOpen] = useState(false);
    const vendorID = hotel.id;
    const totalDays = days_between(new Date(search.checkin).setHours(0, 0, 0, 0), new Date(search.checkout).setHours(0, 0, 0, 0));
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [photoRoomIndex, setPhotoRoomIndex] = useState(0);
    const [submitRooms, setSubmitRooms] = useState(false);
    const [roomImgsData, setRoomImgsData] = useState([]);

    let hotelArea = '';

    if (hotel.area_id !== '') {
        hotelArea = areas.map((area) => {
            if (hotel.area_id === area.area_id) {
                return area.area_name;
            }
            else
            {
                return '';
            }
        })
        hotelArea = hotelArea.filter(Boolean);
        hotelArea = hotelArea.toString();
    }

    const isHotelImgOpenToggle = () => {
        setisHotelImgOpen(!isHotelImgOpen);
    }

    const isRoomImgOpenToggle = (data) => {
        setPhotoRoomIndex(0);
        setisRoomImgOpen(!isRoomImgOpen);
        setRoomImgsData(data);
    }

    const addRoom = (data) => {
        let count = 0;
        let obj = {};
        obj.id = data.id;
        if (selectedRoom.length > 0) {
            let newObj = selectedRoom.map((room, index) => {
                if (room.id === obj.id) {
                    count = 1;
                    let x = room.qty;
                    if (x + 1 <= room.room_quantity) {
                        x += 1;
                    }
                    room.qty = x;
                }
                return room;
            });
            setSelectedRoom(newObj);
        }
        if (count === 0) {
            obj.title = data.title;
            obj.price = data.one_night_price;
            obj.room_quantity = data.room_quantity;
            obj.qty = 1;

            if (data.room_images.length > 0) {
                obj.img = data.room_images[0].image_path;
                obj.img_alt = data.room_images[0].image_name;
            }
            else {
                obj.img = '/no-image.png';
                obj.img_alt = 'Not Found';
            }
            setSelectedRoom([...selectedRoom, obj]);
        }
    }

    const deleteRoom = (id) => {
        let sRooms = selectedRoom;
        let ind = -1;

        if (sRooms.length > 0) {
            sRooms.map((room, index) => {
                if (room.id === id) {
                    ind = index;
                }
            });
            if (ind > -1) {
                delete sRooms[ind];
                ind = -1;
                sRooms = sRooms.filter(Boolean);
            }
        }

        if (sRooms.length > 0) {
            setSelectedRoom(sRooms);
        }

        if (sRooms.length === 0) {
            setSelectedRoom([]);
        }
    }

    const calTotalPrice = () => {
        let x = 0;
        selectedRoom.map((room) => {
            x += Number(room.price);
            x = x * room.qty;
            return 0;
        });
        x *= totalDays;
        if (x > 0) {
            setTotalPrice(x);
        }
        else {
            setTotalPrice(0);
        }
    }

    const increaseCount = (id, total) => {
        if (selectedRoom.length > 0) {
            let incObj = selectedRoom.map((room) => {
                if (room.id === id) {
                    let x = room.qty;
                    if (x < total) {
                        x += 1;
                        room.qty = x;
                    }
                }
                return room;
            })
            setSelectedRoom(incObj);
        }
        calTotalPrice();
    }

    const decreaseCount = (id) => {
        if (selectedRoom.length > 0) {
            let decObj = selectedRoom.map((room) => {
                if (room.id === id) {
                    let x = room.qty;
                    if (x >= 2) {
                        x -= 1;
                        room.qty = x;
                    }
                }
                return room;
            })
            setSelectedRoom(decObj);
        }
        calTotalPrice();
    }

    const HotelImgs = hotel.vendor_images.map((img) => {
        if (img.image_path) {
            return { src: `${img.image_path}`, name: `${img.image_name}` };
        }
        else
        {
            return { src: '', name: '' }
        }
    });

    let rImgs = (hotel.rooms.length > 0) ?
        hotel.rooms.map((room) => {
            if (room.room_images.length > 0) {
                return room.room_images.map((img) => {
                    if (img.image_path) {
                        return { src: `${img.image_path}`, name: `${img.image_name}` };
                    }
                })
            }
            else {
                return [];
            }
        })
        :
        [];

    rImgs = rImgs.filter(Boolean);

    const RoomImgs = rImgs;

    let rating = 0;

    if (Number(hotel.rating) === 1) {
        rating = 20;
    }
    else if (Number(hotel.rating) === 2) {
        rating = 40;
    }
    else if (Number(hotel.rating) === 3) {
        rating = 60;
    }
    else if (Number(hotel.rating) === 4) {
        rating = 80;
    }
    else if (Number(hotel.rating) === 5) {
        rating = 100;
    }

    useEffect(() => {
        // if (selectedRoom.length > 0) {
        //     calTotalPrice();
        // }
        if (submitRooms) {
            try {
                selectedRoomsList({ selectedRoom, totalPrice, vendorID });
                history({ pathname: `/hotel-booking/${btoa(hotel.property_full_name)}` })
            }
            catch (error) { }
        }
    }, [selectedRoom, submitRooms, totalPrice, calTotalPrice, history, hotel, selectedRoomsList, vendorID]);

    return (
        <ErrorBoundary>
            <HotelDetailsMain className='row m-2 flex-column p-3 border border-rounded'>
                {
                    (selectedRoom.length > 0) &&
                    <div className='col-md-12 p-3 mb-3 border rounded border-primary'>
                        <h4 className='font-weight-bold text-primary text-capitalize'>
                            {
                                (hotel.vendor_type === 'hotel') ?
                                    'Selected Rooms'
                                    :
                                    (hotel.vendor_type === 'apartment' || hotel.vendor_type === 'cottage' || hotel.vendor_type === 'resort') &&
                                    `Selected ${hotel.vendor_type.replaceAll('-', ' ')}s`
                            }
                        </h4>
                        {
                            selectedRoom.map((sRoom, index) => {
                                return (
                                    <div className='d-flex p-2 m-2 selected-rooms' key={index}>
                                        <div className='col-md-11 row'>
                                            <div className='col-md-3 m-auto text-center'>
                                                <img
                                                    src={sRoom.img}
                                                    alt={sRoom.img_alt}
                                                    onError={
                                                        ({ currentTarget }) => {
                                                            currentTarget.onerror = null; // prevents looping
                                                            currentTarget.src = "/no-image.png";
                                                        }
                                                    }
                                                    width={100}
                                                    height={50}
                                                />
                                            </div>
                                            <div className='col-md-5 m-auto'>
                                                <h4 className='font-weight-bold selected-room-title'>{sRoom.title}</h4>
                                            </div>
                                            <div className='col-md-2 m-auto'>
                                                <h4 className='selected-room-price font-weight-bold'>{`PKR ${sRoom.price}`}</h4>
                                            </div>
                                            <div className='col-md-2 m-auto'>
                                                <div className="booking-form-counter d-flex flex-row">
                                                    <div className="value-button" id="decrease" onClick={() => { decreaseCount(sRoom.id) }} value="Decrease Value"><i className="far fa-minus-square" id="roomQtyIcon" /></div>
                                                    <input type="number" className='qty-input' id="roomQty" value={sRoom.qty} readOnly />
                                                    <div className="value-button" id="increase" onClick={() => { increaseCount(sRoom.id, sRoom.room_quantity) }} value="Increase Value"><i className="far fa-plus-square" id="roomQtyIcon" /></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-1 m-auto text-center' onClick={() => { deleteRoom(sRoom.id) }}>
                                            <i className="fas fa-times text-primary cursor-pointer" />
                                        </div>
                                    </div>
                                );
                            })
                        }
                        <div className='row p-2 m-2 total-row'>
                            <div className='col-md-6 row grand-total'>
                                <div className='col-md-6 text-left m-auto'>
                                    <h4 className='font-weight-bold m-auto ml-0'>Grand Total: </h4>
                                </div>
                                <div className='col-md-6 text-left m-auto'>
                                    <h5 className='font-weight-bold m-auto'>{`PKR ${totalPrice} (For ${totalDays} Days)`}</h5>
                                </div>
                            </div>
                            <ViewHotelButton className='col-md-6 text-right m-0 selected-rooms-btn'>
                                <button onClick={() => { setSubmitRooms(true) }} >
                                    Proceed to Booking <AiFillRightCircle className='m-auto' />
                                </button>
                            </ViewHotelButton>
                        </div>
                    </div>
                }
                <div className='col-md-12 d-flex flex-row'>
                    <h2 className='hotel-title'>
                        <span className='text-capitalize align-middle w-10 badge badge-warning' style={{ fontSize: '50%' }}>
                            {hotel.vendor_type.replaceAll('-', ' ')}
                        </span>
                        {` ${hotel.property_full_name}`}
                    </h2>
                </div>
                <div className='col-md-6'>
                    <Rating
                        ratingValue={Number(rating)}
                        readonly={true}
                        emptyIcon={<i className="far fa-star" style={{ fontSize: 20 }} />}
                        fullIcon={<i className="fa fa-star" style={{ color: "#ffd700", fontSize: 20 }} />}
                    />
                </div>
                <div className='col-md-12 mt-2'>
                    <h5><i className="fas fa-map-marker-alt" /> {(hotelArea === '') ? ` ${search.sName}` : `${hotelArea}, ${search.sName}`}</h5>
                </div>
                {
                    (hotel.address !== null) &&
                    <div className='col-md-12 mt-2 mb-3'>
                        <h5><i className="fas fa-map-marked-alt" /> {` ${hotel.address}`}</h5>
                    </div>
                }

                <div className='col-md-12 mt-2 mb-3 row'>
                    <div className='col-md-6 flex-column mb-3'>
                        <div className='col-md-12 p-4 img-thumbnail text-center'>
                            {
                                (HotelImgs && HotelImgs.length > 0) ?
                                    <img
                                        src={HotelImgs[0].src}
                                        onError={
                                            ({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src = "/no-image.png";
                                            }
                                        }
                                        alt={HotelImgs[0].name}
                                        className='cursor-pointer' onClick={() => isHotelImgOpenToggle()}
                                    />
                                    :
                                    <img src={'/no-image.png'} alt='Not Found' />
                            }
                        </div>
                        {
                            (HotelImgs.length > 1) &&
                            <div className='col-md-12 pl-0 mt-2'>
                                {
                                    HotelImgs.map((img, index) => {
                                        if (index > 0) {
                                            return <img
                                                src={img.src}
                                                onError={
                                                    ({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = "/no-image.png";
                                                    }
                                                }
                                                alt={img.src}
                                                key={index}
                                                className='cursor-pointer img-thumb'
                                                onClick={() => isHotelImgOpenToggle()} />
                                        }
                                        else {
                                            return '';
                                        }
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className='col-md-6 flex-column mb-3'>
                        <h3>Description</h3>
                        <p className='text-justify desc' dangerouslySetInnerHTML={{ __html: hotel.description }} />
                    </div>
                </div>
                {
                    (hotel.location !== null) &&
                    <div
                        className="col-md-12 mt-2 mb-3 mx-auto vendor-location-iframe"
                        id="property-location"
                        title={hotel.property_full_name}
                        dangerouslySetInnerHTML={{ __html: hotel.location }}
                    />
                }
                <div className='col-md-12 mt-2 mb-3 row'>
                    <div className='col-md-6 mb-4'>
                        <h3 className='font-weight-bold feature-heads'>Amenities</h3>
                        {
                            hotel.vendor_amenities.map((amenItem, index) => {
                                let label = amenItem.amenity;
                                label = label.replaceAll(' ', '-');
                                return <div className='col-md-12 row mt-2 features' key={index}>
                                    <div className='col-md-2 feature-width'>
                                        <img alt='Amenities Icon' src={require(`../../../assets/img/icons/${label}.svg`)} width={30} />
                                    </div>
                                    <div className='col-md-10 my-auto feature-width w-75'>
                                        <h5 className='add-ons'>{amenItem.amenity}</h5>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className='col-md-6 mb-4'>
                        <h3 className='font-weight-bold feature-heads'>Complimentaries</h3>
                        {
                            hotel.vendor_complimentaries.map((compItem, index) => {
                                let label = compItem.complimentary;
                                label = label.replaceAll(' ', '-');
                                return <div className='col-md-12 row mt-2 features' key={index}>
                                    <div className='col-md-2 feature-width'>
                                        <img alt='Complimentaries Icon' src={require(`../../../assets/img/icons/${label}.svg`)} width={30} />
                                    </div>
                                    <div className='col-md-10 my-auto feature-width w-75'>
                                        <h5 className='add-ons'>{compItem.complimentary}</h5>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='col-md-12 mt-2 mb-3 row'>
                    {
                        (hotel.rooms && hotel.rooms.length > 0) &&
                        hotel.rooms.map((room, index) => {
                            return (
                                <div className='row p-4 m-3 rooms-shadow rounded w-100' key={index}>
                                    <div className='col-md-12 d-flex rooms-details'>
                                        <div className='col-md-3 text-center text-center room-img my-auto'>
                                            {
                                                (RoomImgs[index].length > 0) ?
                                                    <img
                                                        className='py-2 px-0 img-fluid'
                                                        src={RoomImgs[index][0].src}
                                                        onError={
                                                            ({ currentTarget }) => {
                                                                currentTarget.onerror = null; // prevents looping
                                                                currentTarget.src = "/no-image.png";
                                                            }
                                                        }
                                                        alt={RoomImgs[index][0].name}
                                                        width={250}
                                                        height={150}
                                                        onClick={() => isRoomImgOpenToggle(RoomImgs[index])}
                                                    />
                                                    :
                                                    <img className='py-2 px-0 img-fluid' src={'/no-image.png'} alt='Not Found' width={250} height={150} />
                                            }
                                        </div>
                                        <div className='col-md-6 d-flex flex-column'>
                                            <h3 className='room-title font-weight-bold'>{room.title}</h3>
                                            <div className='hotel-room-details'>
                                                <div className='d-flex'>
                                                    <img alt='Adults Icon' src={'/adults.svg'} width={25} />
                                                    <div className='col-md-10'>
                                                        <label className='mt-2 m-auto'>{`Max Adults: ${room.no_of_adults}`}</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <img alt='Children Icon' src={'/children.svg'} width={25} />
                                                    <div className='col-md-10'>
                                                        <label className='mt-2 m-auto'>{`Max Children: ${room.no_of_childs}`}</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <img alt='Bed Icon' src={'/bed.svg'} width={25} />
                                                    <div className='col-md-10'>
                                                        <label className='mt-2 m-auto'>{`${room.no_of_beds} x ${room.bed_type}`}</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    {
                                                        (room.refundable === 'Yes') ?
                                                            <span className='badge badge-success p-2'>Refundable</span>
                                                            :
                                                            <span className='badge badge-danger p-2'>Non-Refundable</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <ViewHotelButton className='col-md-3 row flex-column text-center align-content-center m-auto select-room-btn'>
                                            <h3>PKR {Number(room.one_night_price)}</h3>
                                            <p>(incl.taxes & fees)</p>
                                            <button onClick={() => { addRoom(room); window.scrollTo(0, 0); }} >
                                                Select
                                            </button>
                                        </ViewHotelButton>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </HotelDetailsMain>
            {
                (isHotelImgOpen) &&
                <ImgsViewer
                    imgs={HotelImgs}
                    currImg={photoIndex}
                    isOpen={isHotelImgOpen}
                    onClickNext={() => { setPhotoIndex((photoIndex + 1) % HotelImgs.length) }}
                    onClickPrev={() => { setPhotoIndex((photoIndex - 1) % HotelImgs.length) }}
                    onClose={() => isHotelImgOpenToggle()}
                />
            }
            {
                (isRoomImgOpen) &&
                <ImgsViewer
                    imgs={roomImgsData}
                    currImg={photoRoomIndex}
                    isOpen={isRoomImgOpen}
                    onClickNext={() => { setPhotoRoomIndex((photoRoomIndex + 1) % roomImgsData.length) }}
                    onClickPrev={() => { setPhotoRoomIndex((photoRoomIndex - 1) % roomImgsData.length) }}
                    onClose={() => isRoomImgOpenToggle()}
                />
            }
        </ErrorBoundary>
    );
}