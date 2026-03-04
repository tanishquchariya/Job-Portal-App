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
                    Connecting Talent With Opportunity
                </span>

                {/* heading */}
                <h1 className='text-5xl font-bold text-foreground'>
                    Find, Apply & <br />
                    Get Your <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Dream Jobs</span>
                </h1>

                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                    Discover thousands of job opportunities from top companies and
                    take the next step in your career journey with TU Job Portal.
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
                        className="flex items-center justify-center px-7 bg-primary text-primary-foreground hover:scale-105 transition-all duration-200"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                </div>

            </div>
        </div>
    )
}

export default HeroSection