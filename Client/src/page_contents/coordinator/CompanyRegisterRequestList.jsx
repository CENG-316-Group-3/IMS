import React from 'react'
import "../../styles/CompanyRegisterRequestList.css";

const ITEMS_PER_PAGE = 6;

function CompanyRegisterRequestList() {
    const [currentPage, setCurrentPage] = React.useState(1);



    const requests = [
        { id: 1, company_name: 'Company A', company_email: 'companyA@mail.com', date: '2024-05-21', company_addres: 'Urla/İzmir IYTE Teknopark' },
        { id: 2, company_name: 'Company B', company_email: 'companyB@mail.com', date: '2024-05-22', company_addres: 'Konak/İzmir' },
        { id: 3, company_name: 'Company C', company_email: 'companyC@mail.com', date: '2024-05-23', company_addres: 'Bornova/İzmir' },
        { id: 4, company_name: 'Company D', company_email: 'companyD@mail.com', date: '2024-05-24', company_addres: 'Çeşme/İzmir' },
        { id: 5, company_name: 'Company E', company_email: 'companyE@mail.com', date: '2024-05-25', company_addres: 'Karşıyaka/İzmir' },
        { id: 6, company_name: 'Company F', company_email: 'companyF@mail.com', date: '2024-05-26', company_addres: 'Balçova/İzmir' },
        { id: 7, company_name: 'Company G', company_email: 'companyG@mail.com', date: '2024-05-27', company_addres: 'Narlıdere/İzmir' },
        { id: 8, company_name: 'Company H', company_email: 'companyH@mail.com', date: '2024-05-28', company_addres: 'Gaziemir/İzmir' },
        { id: 9, company_name: 'Company I', company_email: 'companyI@mail.com', date: '2024-05-29', company_addres: 'Buca/İzmir' },
        { id: 10, company_name: 'Company J', company_email: 'companyJ@mail.com', date: '2024-05-30', company_addres: 'Menemen/İzmir' },
        { id: 11, company_name: 'Company K', company_email: 'companyK@mail.com', date: '2024-05-31', company_addres: 'Aliağa/İzmir' },
        { id: 12, company_name: 'Company L', company_email: 'companyL@mail.com', date: '2024-06-01', company_addres: 'Seferihisar/İzmir' },
        { id: 13, company_name: 'Company M', company_email: 'companyM@mail.com', date: '2024-06-02', company_addres: 'Torbalı/İzmir' }
    ];


    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    return (
        <div className="comp-requests-container">
            <h2>Company Register Requests</h2>
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Company Email</th>
                        <th>Date</th>
                        <th>Adress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((request) => (
                        <tr key={request.id}>
                            <td>{request.company_name}</td>
                            <td>{request.company_email}</td>
                            <td>{request.date}</td>
                            <td>{request.company_addres}</td>
                            <td>
                                <div className='req-approve-reject-btns'>
                                    <button className="req-approve-btn" >Approve</button>
                                    <button className="req-reject-btn" >Reject</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleClick(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CompanyRegisterRequestList
