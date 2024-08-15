import React from 'react'

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    &copy;{year}. All Rights Reserved.
                </div>
            </div>
        </div>
    )
}
