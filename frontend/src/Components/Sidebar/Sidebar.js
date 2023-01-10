import React from 'react';

const Sidebar = () => {
    let sidebarData = {};

    fetch('/sidebar')
        .then((res) => res.json()
            .then((data) => {
                sidebarData = data.sections
                console.log(sidebarData.bells)
                return (
                    // sidebarData.map((d, index) => (
                    //     <p>{d}</p>
                    // ))
                    <p>{sidebarData.bells}</p>
                )
            })
        );

}

export default Sidebar;