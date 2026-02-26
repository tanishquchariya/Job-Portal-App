import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        // ✅ DARK-MODE SAFE CARD
        <div className='w-full bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm transition-colors duration-300'>
            
            {/* heading */}
            <h1 className='font-bold text-lg text-foreground'>
                Filter Jobs
            </h1>

            <hr className='mt-3 border-border' />

            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => (
                        <div key={index} className="mt-4">
                            
                            {/* section title */}
                            <h2 className='font-semibold text-foreground mb-2'>
                                {data.fitlerType}
                            </h2>

                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div key={itemId} className='flex items-center space-x-2 my-2'>
                                            
                                            {/* ✅ visible in dark */}
                                            <RadioGroupItem
                                                value={item}
                                                id={itemId}
                                                className="border-border"
                                            />

                                            <Label
                                                htmlFor={itemId}
                                                className="text-muted-foreground cursor-pointer"
                                            >
                                                {item}
                                            </Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard