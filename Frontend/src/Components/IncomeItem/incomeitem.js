import React from "react";
import styled from "styled-components";
import { dollar,calender,comment,trash,money,freelance,stocks,users,bitcoin,card,yt,piggy,book, food,medical,tv,takeaway,clothing,circle } from '../../Utils/icons';
import Button from "../Button/button";
import {dateFormat} from "../../Utils/dateFormat";

function IncomeItem({
                        id,
                        title,
                        amount,
                        date,
                        category,
                        description,
                        deleteItem,
                        indicatorColor,
                        type,
                        isRecurring,
                        recurringInterval,
                        onEdit
                    }) {
    const categoryIcon = () =>{
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'other':
                return piggy;
            default:
                return ''
        }
    }
    const expenseCatIcon = () => {
        switch (category) {
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'other':
                return circle;
            default:
                return ''
        }
    }
    return(
        <IncomeItemStyled indicator={indicatorColor}>
            <div className="icon">
                {type==='expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{title}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>{dollar} {amount}</p>
                        <p>{calender} {dateFormat(date)}</p>
                        <p>{comment} {description}</p>
                        {isRecurring && (
                            <p className="recurring-badge">
                                🔄 <span>{recurringInterval}</span>
                            </p>
                        )}
                    </div>
                    <div className="btn-con">
                        {onEdit && (
                            <Button
                                icon={<i className="fa-solid fa-pen-to-square"></i>}
                                bPad={'1rem'}
                                bRad={'50%'}
                                bg={'#667eea'}
                                color={'#fff'}
                                iColor={'#fff'}
                                hColor={'#764ba2'}
                                onClick={() => onEdit(id)}
                            />
                        )}
                        <Button
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--primary-color'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={()=>deleteItem(id)}
                        />
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    )
}

const IncomeItemStyled = styled.div`
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    box-shadow: 0px 1px 15px var(--shadow-color);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;
    .icon{
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: var(--icon-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--card-border);
        i{
            font-size: 2.6rem;
        }
    }

    .content{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .2rem;
        h5{
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before{
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .text{
                display: flex;
                align-items: center;
                gap: 1.5rem;
                p{
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
                .recurring-badge {
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                    padding: 2px 10px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    opacity: 1;
                    span { text-transform: capitalize; }
                }
            }
            .btn-con {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        }
    }
`;

export default IncomeItem