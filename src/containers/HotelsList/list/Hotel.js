import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import ImgsViewer from "react-images-viewer";
import ErrorBoundary from '../../../helper/ErrorBoundary';
import {HotelListMain, ViewHotelButton} from '../wrapper/HotelListStyle';

export default function Hotel({hotel, cities})
{
    const history = useNavigate();
    const [isOpen, setisOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const city = cities.filter(citi => citi.sector_id === hotel.sector_id);
    
    const isOpenToggle = () => {
        setisOpen(!isOpen);
    }
    const images = hotel.vendor_images.map((img)=>{
        if (img.image_path)
        {
            return {src: `${img.image_path}`};
        }
        else
        {
            return '';
        }
    });
    let rating = 0;
    if(Number(hotel.rating) === 1)
    {
        rating = 20;
    }
    else if(Number(hotel.rating) === 2)
    {
        rating = 40;
    }
    else if(Number(hotel.rating) === 3)
    {
        rating = 60;
    }
    else if(Number(hotel.rating) === 4)
    {
        rating = 80;
    }
    else if(Number(hotel.rating) === 5)
    {
        rating = 100;
    }
    return (
        <ErrorBoundary>
            <HotelListMain>
                <div className='col-md-12 m-auto row p-3 hotel-details'>
                    <div className='col-md-3'>
                        {
                            (images && images.length > 0) ? 
                                <img 
                                    alt='Hotel Front'
                                    src={images[0].src} 
                                    className='cursor-pointer' 
                                    onError={
                                        ({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src="/no-image.png";
                                        }
                                    }
                                    onClick={()=>isOpenToggle()} 
                                    height={120} 
                                    width={200}
                                />
                            :
                                <img alt='Not Found' src={'/no-image.png'} height={120} width={200}/>
                        }
                        
                    </div>
                    <div className='col-md-6 d-flex flex-column hotel-title'>
                        <h3>{hotel.property_full_name}</h3>
                        <Rating 
                            ratingValue={Number(rating)}
                            readonly={true}
                            emptyIcon={<i className="far fa-star"/>}
                            fullIcon={<i className="fa fa-star" style={{color: "#ffd700"}}/>}
                            size={15}
                        />
                        <span>
                            <i className="fas fa-map-marker-alt" /> {` ${city[0].sector_name}`}
                        </span>
                        <span className='text-capitalize w-25 badge badge-warning' >
                            {hotel.vendor_type.replaceAll('-', ' ')}
                        </span>
                    </div>
                    <ViewHotelButton className='col-md-3 row flex-column text-center align-content-center align-self-center m-0'>
                        <h3>
                            {
                                (hotel.rooms.length > 0) ?
                                    `PKR ${hotel.rooms[0].one_night_price}`
                                :
                                    `PKR 0`
                            }
                        </h3>
                        <p>{'(incl.taxes & fees)'}</p>
                        <button onClick={()=>{
                            history( {
                                pathname: `/hotel-detail-view/${btoa(hotel.id)}`
                            });
                        }}>
                            View Hotel
                        </button>
                    </ViewHotelButton>
                </div>
                {
                    (isOpen) &&
                        <ImgsViewer 
                            imgs={images}
                            currImg={photoIndex}
                            isOpen={isOpen}
                            onClickNext={()=>{setPhotoIndex((photoIndex + 1) % images.length)}}
                            onClickPrev={()=>{setPhotoIndex((photoIndex - 1) % images.length)}}
                            onClose={() => isOpenToggle()}
                        />
                }
            </HotelListMain> 
        </ErrorBoundary>
    );
}