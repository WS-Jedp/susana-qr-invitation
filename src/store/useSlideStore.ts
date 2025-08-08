import { create } from 'zustand';

export interface Slide {
  id: number | string;
  title: string;
  styles?: string[];
  quote?: string;
  subtext?: string[];
  points?: string[];
  questions?: string[];
  imagePlaceholder?: string;
  description?: string;
  cta?: {
    type: 'primary' | 'secondary';
    label: string;
    action: string;
  };
  postscript?: string;
  audio?: {
    src: string;
    loop: {
      start: number;
      end: number;
    };
  };
}

export interface StorytellingData {
  storytelling: {
    slides: Slide[];
  };
}

interface SlideState {
  slides: Slide[];
  currentSlideIndex: number;
  isLoading: boolean;
  error: string | null;
  scrollMode: 'vertical' | 'horizontal';
  horizontalSlideIndex: number;
  
  // Actions
  setSlides: (slides: Slide[]) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadData: () => Promise<void>;
  setScrollMode: (mode: 'vertical' | 'horizontal') => void;
  nextHorizontalSlide: () => void;
  prevHorizontalSlide: () => void;
  setHorizontalSlideIndex: (index: number) => void;
}

export const useSlideStore = create<SlideState>((set, get) => ({
  slides: [],
  currentSlideIndex: 0,
  isLoading: false,
  error: null,
  scrollMode: 'vertical',
  horizontalSlideIndex: 0,

  setSlides: (slides) => set({ slides }),
  
  nextSlide: () => {
    const { slides, currentSlideIndex } = get();
    if (currentSlideIndex < slides.length - 1) {
      set({ currentSlideIndex: currentSlideIndex + 1, horizontalSlideIndex: 0 });
    }
  },
  
  prevSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1, horizontalSlideIndex: 0 });
    }
  },
  
  goToSlide: (index) => {
    const { slides } = get();
    if (index >= 0 && index < slides.length) {
      set({ currentSlideIndex: index, horizontalSlideIndex: 0 });
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setScrollMode: (mode) => set({ scrollMode: mode }),
  
  nextHorizontalSlide: () => {
    const { horizontalSlideIndex } = get();
    if (horizontalSlideIndex < 7) {
      set({ horizontalSlideIndex: horizontalSlideIndex + 1 });
    }
  },
  
  prevHorizontalSlide: () => {
    const { horizontalSlideIndex } = get();
    if (horizontalSlideIndex > 0) {
      set({ horizontalSlideIndex: horizontalSlideIndex - 1 });
    }
  },
  
  setHorizontalSlideIndex: (index) => set({ horizontalSlideIndex: index }),
  
  loadData: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data: StorytellingData = await response.json();
      set({ 
        slides: data.storytelling.slides,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },
}));
