'use client'
import React, {useState} from "react";

import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import './slideshow.css';
import {Autoplay, FreeMode, Navigation, Pagination, Thumbs} from "swiper/modules";
import Image from "next/image";
import {ProductImage} from "@/components";

interface Props {
    images: string[];
    title: string;
    className?: string
}

export const ProductMobileSlideShow = ({images, title, className}: Props) => {
    return (
        <div className={className}>
            <Swiper
                style={{
                    width: '100vh',
                    height: '500px'
                }}
                pagination
                autoplay={
                    {
                        delay: 2500,
                    }
                }
                modules={[FreeMode, Navigation, Pagination, Autoplay]}
                className="mySwiper2"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <ProductImage width={600}
                                   height={500}
                                   alt={title}
                                   src={image}
                                   className="object-fill"
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>

    );
};

