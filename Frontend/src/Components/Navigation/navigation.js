import React, {useState} from 'react';
import styled from "styled-components";
import avatar from "../../img/avatar.png"
import {menuItems} from "../../Utils/menuitems";
import {signout} from "../../Utils/icons";
import {useAuth} from "../../Context/authContext";
import {useNavigate} from "react-router-dom";

function Navigation({ active, setActive }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

    const handleNavClick = (id) => {
        setActive(id);
        setMobileOpen(false);
    };

    const avatarSrc = user?.avatar ? `http://localhost:5000${user.avatar}` : avatar;

    return (
        <>
            <MobileToggle onClick={() => setMobileOpen(!mobileOpen)} className={mobileOpen ? 'open' : ''}>
                <span></span>
                <span></span>
                <span></span>
            </MobileToggle>
            {mobileOpen && <Backdrop onClick={() => setMobileOpen(false)} />}
            <NavStyled className={mobileOpen ? 'mobile-open' : ''}>
                <div className="user-con">
                    <img src={avatarSrc} alt="avatar" />
                    <div className="text">
                        <h2>{user?.name || 'User'}</h2>
                        <p>Your Money</p>
                    </div>
                </div>
                <ul className="menu-items">
                    {menuItems.map((item)=>{
                        return <li
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={active === item.id ? 'active': ''}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </li>
                    })}
                </ul>
                <div className="bottom-nav">
                    <li onClick={handleSignOut}>
                        {signout} Sign Out
                    </li>
                </div>
            </NavStyled>
        </>
    )
}

const Backdrop = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: block;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(3px);
        z-index: 99;
    }
`;

const MobileToggle = styled.button`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 200;
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        border-radius: 12px;
        padding: 10px;
        cursor: pointer;
        box-shadow: 0 4px 15px var(--shadow-color);
        span {
            display: block;
            width: 22px;
            height: 2.5px;
            background: var(--primary-color);
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        &.open {
            span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
            span:nth-child(2) { opacity: 0; }
            span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        }
    }
`;

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: var(--nav-bg);
    border: 3px solid var(--card-border);
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: -400px;
        height: 100vh;
        z-index: 100;
        border-radius: 0 24px 24px 0;
        transition: left 0.3s ease;
        &.mobile-open {
            left: 0;
        }
    }

    .user-con{
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: var(--card-bg);
            border: 2px solid var(--card-border);
            padding: .2rem;
            box-shadow: 0px 1px 17px var(--shadow-color);
        }
        h2{
            color: var(--primary-color);
        }
        p{
            color: var(--primary-color2);
        }
    }

    .menu-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        li{
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: var(--primary-color2);
            padding-left: 1rem;
            position: relative;
            i{
                color: var(--primary-color2);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active{
        color: var(--primary-color) !important;
        i{
            color: var(--primary-color) !important;
        }
        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: var(--primary-color);
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav {
        li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            color: var(--primary-color2);
            font-weight: 500;
            padding: 0.8rem 1rem;
            border-radius: 12px;
            transition: all 0.3s ease;
            &:hover {
                background: rgba(255, 71, 87, 0.08);
                color: #ff4757;
                i {
                    color: #ff4757;
                }
            }
        }
    }
`;

export default Navigation;