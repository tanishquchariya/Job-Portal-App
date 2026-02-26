import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        // ✅ FIXED: theme-aware card
        <div className='p-5 rounded-md shadow-sm bg-card text-card-foreground border border-border transition-colors duration-300'>
            
            {/* top row */}
            <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                    {daysAgoFunction(job?.createdAt) === 0
                        ? "Today"
                        : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full" size="icon">
                    <Bookmark />
                </Button>
            </div>

            {/* company info */}
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg text-foreground'>
                        {job?.company?.name}
                    </h1>
                    <p className='text-sm text-muted-foreground'>India</p>
                </div>
            </div>

            {/* job title */}
            <div>
                <h1 className='font-bold text-lg my-2 text-foreground'>
                    {job?.title}
                </h1>
                <p className='text-sm text-muted-foreground'>
                    {job?.description}
                </p>
            </div>

            {/* badges */}
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge variant="secondary">{job?.position} Positions</Badge>
                <Badge variant="secondary">{job?.jobType}</Badge>
                <Badge variant="secondary">{job?.salary} LPA</Badge>
            </div>

            {/* buttons */}
            <div className='flex items-center gap-4 mt-4'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                >
                    Details
                </Button>
                <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    Save For Later
                </Button>
            </div>
        </div>
    )
}

export default Job