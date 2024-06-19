import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const options: IntersectionObserverInit = {
  root: null,
  threshold: 0.6,
  rootMargin: '0px',
};

export const useCarousel = () => {
  const [isControlOnCooldown, setIsControlOnCooldown] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [carouselSlides, setCarouselSlides] = useState<Element[]>([]);

  const carouselRef = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();

  function carouselControls(direction: 'previous' | 'next'): void {
    const CAROUSEL_CONTROL_COOLDOWN = 500;
    if (isControlOnCooldown) return;
    setIsControlOnCooldown(true);

    setCurrentSlideIndex((currentSlide) => {
      const previous = carouselSlides[currentSlide]?.previousElementSibling;
      const next = carouselSlides[currentSlide]?.nextElementSibling;

      const previousSlide = previous ? carouselSlides.indexOf(previous) : currentSlide;
      const nextSlide = next ? carouselSlides.indexOf(next) : currentSlide;
      const index = direction === 'previous' ? previousSlide : nextSlide;

      scrollToSlide(index);
      return index;
    });

    setTimeout(() => setIsControlOnCooldown(false), CAROUSEL_CONTROL_COOLDOWN);
  }

  function scrollToSlide(index: number): void {
    carouselSlides[index]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  useEffect(() => {
    (function resetCarouselSlides(): void {
      const carousel = carouselRef.current;
      if (!carousel) return;

      setCurrentSlideIndex(0);
      carousel.scrollTo({ left: 0 });
      setCarouselSlides(Array.from<Element>(carousel.getElementsByTagName('li')));
    })();
  }, [pathname]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(callback, options);

    function callback(entries: IntersectionObserverEntry[]): void {
      entries.forEach((slide) => {
        if (slide.isIntersecting) {
          setCurrentSlideIndex(carouselSlides.indexOf(slide.target));
        }
      });
    }

    carouselSlides.forEach((slide) => intersectionObserver.observe(slide));
    return () => carouselSlides.forEach((slide) => intersectionObserver.unobserve(slide));
  }, [carouselSlides]);

  return { carouselRef, currentSlideIndex, scrollToSlide, carouselControls };
};
