import React from 'react'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-lg shadow-sm bg-card text-card-foreground border border-border cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1'
        >
            {/* 🔥 COMPANY HEADER WITH LOGO */}
            <div className='flex items-center gap-3 mb-3'>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={job?.company?.logo} />
                </Avatar>

                <div>
                    <h1 className='font-semibold text-foreground'>
                        {job?.company?.name}
                    </h1>
                    <p className='text-xs text-muted-foreground'>India</p>
                </div>
            </div>

            {/* job title */}
            <h1 className='font-bold text-lg my-2 text-foreground'>
                {job?.title}
            </h1>

            {/* description */}
            <p className='text-sm text-muted-foreground line-clamp-2'>
                {job?.description}
            </p>

            {/* badges */}
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge variant="secondary">
                    {job?.position} Positions
                </Badge>
                <Badge variant="secondary">
                    {job?.jobType}
                </Badge>
                <Badge variant="secondary">
                    {job?.salary} LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards