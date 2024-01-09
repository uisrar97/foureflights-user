import styled from 'styled-components';
import { StyleSheet } from '@react-pdf/renderer';

export const ConfirmParent = styled.div`
    width: 100%;
    display: flex;
    padding: 5px;
    flex-wrap: wrap;
    overflow: hidden;
    background-color: #fff;
    .main
    {
        flex-basis: 100%;
        padding: 10px;
        .success, .failure
        {
            width: 60%;
            text-align: center;
            margin: auto;
        }
        
        .success
        {
            width: 100% !important;
            hr
            {
                margin: 30px 0px 30px 0px;
            }
            h3
            {
                font-size: 25px;
                margin-bottom: 30px;
            }
            .success-head
            {
                h2
                {
                    padding-top: 20px;
                    @media(max-width: 800px)
                    {
                        font-size: 4.2vw;
                        
                    }
                    @media(max-width: 480px)
                    {
                        font-size: 4.7vw;
                        font-weight: 800;
                    }
                }
            }
            .flight-info
            {
                text-align: unset !important;
            }
            .PAX-info, .flight-info
            {
                display: flex;
                width: 100%;
                text-align: left;
                margin-bottom: 30px;
            }
            .PAX-info
            {
                flex-direction: row;
                .left, .right
                {
                    flex-basis: 50%;
                    flex-direction: column;
                    .PAX-inner-row
                    {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 10px;
                        h4, p 
                        {
                            color: black;
                            font-size: 14px;
                            @media(max-width: 450px)
                            {
                                font-size: 13px;
                            }
                            @media(max-width: 405px)
                            {
                                font-size: 12px;
                            }
                        }
                        h4
                        {
                            font-weight: bold;
                        }
                        *
                        {
                            flex-basis: 50%;
                            margin-top: auto;
                            margin-bottom: auto;
                        }
                    }
                    @media(max-width: 800px)
                    {
                        flex-basis: 100%;
                    }
                }
                @media(max-width: 800px)
                {
                    flex-direction: column;
                    padding-left: 10%;
                }
            }
            .flight-info
            {
                border: 2px solid #378cdd;
                padding: 15px;
                .flight-inner-row
                {
                    display: flex;
                    flex-direction: row;
                    text-align: left;
                    flex-basis: 100%;
                    margin-bottom: 20px;
                    *
                    {
                        margin-top: auto;
                        margin-bottom: auto;
                    }
                    .flight-status
                    {
                        color: green;
                    }
                    p
                    {
                        color: black;
                        font-size: 20px;
                        @media (max-width: 800px)
                        {
                            font-size: 17px;
                        }
                    }
                }
            }
            .agent
            {
                text-align: left;
                p
                {
                    font-weight: bold; 
                }
            }
            @media (max-width: 800px)
            {
                padding: 5px;
                width: 100%;
            }
        }
        .foot
        {
            text-align: center;
            margin-bottom: 20px;
            .PayInfo
            {
                border: 2px solid #378edd;
            }
            a
            {
                margin-left: 5px;
                border-radius: 3px;
                text-shadow: 0px 0px 2px #776565;
                text-decoration: none;
                font-weight: bold;
                font-size: 1vw;
                background: #378edd;
                color: #ffffff;
                padding: 12px 10px;
                border: none;
                transition: backgroung 0.5s;
                box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
                &: hover
                {
                    background: #fcb040;
                }
                @media(max-width: 1110px)
                {
                    font-size: 1.2vw;
                }
                @media(max-width: 900px)
                {
                    font-size: 1.5vw;
                }
                @media(max-width: 700px)
                {
                    font-size: 1.8vw;
                }
                @media(max-width: 580px)
                {
                    font-size: 2.2vw;
                }
                @media(max-width: 470px)
                {
                    font-size: 3vw;
                }
            }
        }
    }
`;

export const FailedBooking = styled.div`
    text-align: center;
    justify-content: center;
    margin-top: 201px;
    margin-bottom: 205px;
    *
    {
        margin-bottom: 30px;
    }
    .foot
    {
        text-align: center;
        margin-bottom: 20px;
        a
        {
            margin-left: 5px;
            border-radius: 3px;
            text-shadow: 0px 0px 2px #776565;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            background: #378edd;
            color: #ffffff;
            padding: 12px 10px;
            border: none;
            transition: backgroung 0.5s;
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
            &: hover
            {
                background: #fcb040;
            }
        }
    }
`;

export const PaymentLoader = styled.div`
    z-index: 999 !important;
    backdrop-filter: blur(5px);
    top: 0;
    left: 0;
    height
`;

export const styles = StyleSheet.create({
    line: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: '#000000',
    },
    PDFHead: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    Logo: {
        maxWidth: '100%',
        width: 100,
    },
    head: {
        display: 'flex',
        flexDirection: 'column',
    },
    link: {
        fontSize: 13,
        marginTop: 10,
        marginLeft: 25,
        textDecoration: 'underline'
    },
    greeting: {
        fontSize: 18,
        marginLeft: 115,
        marginBottom: 60,
        fontWeight: '900'
    },
    heading: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 7,
        marginLeft: 30,
    },
    PAXInfo: {
        marginLeft: 10,
        marginTop: 0,
        fontSize: 10,
    },
    left: {
        marginBottom: 5,
        marginLeft: 1,
    },
    right: {
        marginLeft: 265,
        marginTop: -15,
        marginBottom: 5,
    },
    flightDetailsHead: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 20,
        marginBottom: 0,
        marginTop: 10
    },
    roomsParent: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        borderWidth: 2,
        borderColor: '#378cdd',
        marginBottom: 20
    },
    roomSNo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    roomName: {
        fontSize: 16,
        marginLeft: 50,
        fontWeight: 'bold',
    },
    roomQty: {
        fontSize: 16,
        marginLeft: 60,
        fontWeight: 'bold',
    },
    roomPPN: {
        fontSize: 16,
        marginLeft: 50,
        fontWeight: 'bold',
    },
    rSNoData: {
        fontSize: 12,
        marginLeft: 10,
    },
    rTitleData: {
        fontSize: 12,
        marginLeft: 40,
    },
    rQtyData: {
        fontSize: 12,
        marginLeft: 100,
    },
    rPPNData: {
        fontSize: 12,
        marginLeft: 80,
    },
    table: {
        display: "table",
    },
    tableRow: {
        flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        textAlign: "center"
    },
    tableCell: {
        marginTop: 5,
        fontSize: 10,
    },
    tableHead: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    agent_head: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    agent_address: {
        fontSize: 10
    },
});

export const InvoiceStyles = StyleSheet.create({
    line: {
        marginTop: 5,
        marginBottom: 5,
        width: '96%',
        marginLeft:'2%',
        marginRight:'2%',
        borderTopWidth: 0.8,
        borderTopStyle: 'solid',
        borderTopColor: '#000000',
    },
    page: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 25,
    },
    PDFHead: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
        marginTop: 45,
    },
    FoureLogo: {
        width: 120,
        marginLeft: -12,
        marginBottom: 20
    },
    heading: {
        flexBasis: '33.3%',
        fontSize: 16,
        marginTop: -18,
        textAlign: 'center'
    },
    HeadLink: {
        flexBasis: '33.3%',
        fontSize: 14,
        marginTop: -18,
        textAlign: 'right',
        textDecoration: 'underline'
    },
    Logo: {
        width: 100,
        marginTop: 10
    },
    InvoiceHead: {
        width: '100%'
    },
    head: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1 px solid black',
        padding: 15
    },
    PAXInfo: {
        marginLeft: 10,
        marginTop: 0,
        fontSize: 10,
    },
    left: {
        marginBottom: 5,
        marginLeft: 1,
        fontFamily: 'Helvetica-Bold'
    },
    right: {
        marginLeft: 150,
        marginTop: -16,
        marginBottom: 5,
    },
    flightDetailsHead: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5
    },
    ACRow: {
        marginLeft: '25%', 
        flex: 'row',
    },
    ACTitle: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: -18,
        marginRight: 90
    },
    agent_address: {
        fontSize: 10,
        marginLeft: 5,
    },
});