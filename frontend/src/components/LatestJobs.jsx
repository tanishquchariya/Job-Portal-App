import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        // ✅ FIXED: theme-aware section wrapper
        <section className='bg-background text-foreground transition-colors duration-300'>
            
            <div className='max-w-7xl mx-auto my-20 px-4'>
                
                {/* heading */}
                <h1 className='text-4xl font-bold'>
                    <span className='text-primary'>Latest & Top </span>
                    Job Openings
                </h1>

                {/* grid */}
                <div className='grid grid-cols-3 gap-4 my-5'>
                    {
                        allJobs.length <= 0
                            ? <span className="text-muted-foreground">No Job Available</span>
                            : allJobs?.slice(0, 6).map((job) => (
                                <LatestJobCards key={job._id} job={job} />
                            ))
                    }
                </div>

            </div>
        </section>
    )
}

export default LatestJobs