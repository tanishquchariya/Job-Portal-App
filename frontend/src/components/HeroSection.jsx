import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10 px-4'>

                {/* badge */}
                <span className='mx-auto px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium'>
                    No. 1 Job Hunt Website
                </span>

                {/* heading */}
                <h1 className='text-5xl font-bold text-foreground'>
                    Search, Apply & <br />
                    Get Your <span className='text-primary'>Dream Jobs</span>
                </h1>

                <p className='text-muted-foreground max-w-2xl mx-auto'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!
                </p>

                {/* 🔥 PERFECT SEARCH BAR */}
                <div className='flex w-full max-w-2xl mx-auto rounded-full border border-border bg-background overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300'>
                    
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='flex-1 bg-transparent px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none'
                    />

                    {/* ✅ native button = perfect control */}
                    <button
                        onClick={searchJobHandler}
                        className="flex items-center justify-center px-6 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                </div>

            </div>
        </div>
    )
}

export default HeroSection