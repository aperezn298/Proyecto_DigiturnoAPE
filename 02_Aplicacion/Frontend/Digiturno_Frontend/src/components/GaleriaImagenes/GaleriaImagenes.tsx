import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Imagene1 from "../../assets/imagen1.png";
import Imagene2 from "../../assets/imagen2.png";
import Imagene3 from "../../assets/imagen3.jpg";
import Imagene4 from "../../assets/imagen4.jpg";
import Imagene5 from "../../assets/imagen5.jpeg";
import { Pagination } from 'swiper/modules';

const images = [
  { original: Imagene1 },
  { original: Imagene2 },
  { original: Imagene3 },
  { original: Imagene4 },
  { original: Imagene5 },


];

export const GaleriaImagenes = () => {
  return (
    <div className="sm:max-w-[1200px] w-full m-auto h-auto rounded-2xl">
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img.original}
              alt={`Slide ${index + 1}`}
              className="w-full h-[150px] sm:h-[150px] md:h-[320px] lg:h-[350px] object-cover rounded-b-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
