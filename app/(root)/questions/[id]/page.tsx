import { RouteParams } from '@/types/global'
import React from 'react'

const QuestionDetailsPage = async ({ params }: RouteParams) => {
    const { id } = await params;

    return (
        <div>Question : {id}</div>
    )
}

export default QuestionDetailsPage