import React from 'react';
import styled from "styled-components";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import {useGlobalContext} from "../../Context/globalContext";
import Button from '../Button/button';
import { plus } from '../../Utils/icons';

function Form() {
    const {addIncome,getIncomes,error,setError} = useGlobalContext()

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
        isRecurring: false,
        recurringInterval: 'monthly',
    })

    const { title, amount, date, category, description, isRecurring, recurringInterval } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
        setError('')
    }
    const handleSubmit = e => {
        e.preventDefault()
        addIncome(inputState)
        setInputState({
            title: '',
            amount: '',
            date: '',
            category: '',
            description: '',
            isRecurring: false,
            recurringInterval: 'monthly',
        })
    }
    return(
        <FormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                {error && <p className='error'>{error}</p>}
                <input
                    type="text"
                    value={title}
                    name={title}
                    placeholder="Salary Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input
                    type="amount"
                    value={amount}
                    name={amount}
                    placeholder="Salary Amount"
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id='date'
                    placeholder='Enter date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({...inputState, date: date});
                    }
                    }
                />
            </div>
            <div className="selects input-control">
                <select required value={category} name="category" id="category" onChange={handleInput('category')}>
                    <option value="" disabled>Select Option</option>
                    <option value="salary">Salary</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Investiments</option>
                    <option value="stocks">Stocks</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="youtube">Youtube</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea name="description" value={description} placeholder='Add A Reference' id="description"
                          cols="30" rows="4" onChange={handleInput('description')}></textarea>
            </div>
            <div className="recurring-control">
                <label className="recurring-toggle">
                    <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setInputState({...inputState, isRecurring: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">🔄 Recurring</span>
                </label>
                {isRecurring && (
                    <select
                        value={recurringInterval}
                        onChange={handleInput('recurringInterval')}
                        className="recurring-select"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                )}
            </div>
            <div className="submit-btn">
                <Button
                    name={'Add Income'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>
        </FormStyled>
    )
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid var(--card-border);
        background: var(--input-bg);
        resize: none;
        box-shadow: 0px 1px 15px var(--shadow-color);
        color: var(--input-text);

        &::placeholder {
            color: var(--primary-color3);
        }
    }

    .input-control {
        input {
            width: 100%;
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;

        select {
            color: var(--primary-color3);

            &:focus, &:active {
                color: var(--primary-color);
            }
        }
    }

    .recurring-control {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .recurring-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: 600;
        color: var(--primary-color2);
        input {
            display: none;
        }
        .toggle-slider {
            width: 40px;
            height: 22px;
            background: #ccc;
            border-radius: 22px;
            position: relative;
            transition: 0.3s;
            border: none;
            box-shadow: none;
            padding: 0;
            &::before {
                content: '';
                position: absolute;
                width: 18px;
                height: 18px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: 0.3s;
            }
        }
        input:checked + .toggle-slider {
            background: linear-gradient(135deg, #667eea, #764ba2);
            &::before {
                transform: translateX(18px);
            }
        }
    }

    .recurring-select {
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
    }

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px var(--shadow-color);

            &:hover {
                background: var(--color-green) !important;
            }
        }
    }
`;

export default Form;