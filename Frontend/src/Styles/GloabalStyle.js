import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }
    :root{
        --primary-color:#222260;
        --primary-color2: rgba(34,34,96,.6);
        --primary-color3: rgba(34,34,96,.4);
        --color-green:#42AD00;
        --color-gray:#aaa;
        --color-accent:#F56692;
        --color-delete:#FF0000;
        --bg-main: url(${props => props.bg});
        --card-bg: #FCF6F9;
        --card-border: #FFFFFF;
        --main-bg: rgba(252, 246, 249, 0.78);
        --main-border: #FFFFFF;
        --nav-bg: rgba(252, 246, 249, 0.78);
        --input-bg: #ffffff;
        --input-border: #e8e8e8;
        --input-text: #222260;
        --shadow-color: rgba(0, 0, 0, 0.06);
        --scrollbar-color: rgba(34, 34, 96, 0.15);
        --body-color: rgba(34,34,96,.6);
        --icon-bg: #F5F5F5;
    }

    [data-theme="dark"] {
        --primary-color: #e2e8f0;
        --primary-color2: rgba(226, 232, 240, 0.7);
        --primary-color3: rgba(226, 232, 240, 0.45);
        --color-green: #48bb78;
        --color-gray: #718096;
        --color-accent: #f687b3;
        --color-delete: #fc8181;
        --card-bg: #1e2a3a;
        --card-border: #2d3e50;
        --main-bg: rgba(15, 23, 42, 0.92);
        --main-border: #1e293b;
        --nav-bg: rgba(15, 23, 42, 0.92);
        --input-bg: #1a2332;
        --input-border: #2d3e50;
        --input-text: #e2e8f0;
        --shadow-color: rgba(0, 0, 0, 0.3);
        --scrollbar-color: rgba(226, 232, 240, 0.15);
        --body-color: rgba(226, 232, 240, 0.7);
        --icon-bg: #1a2332;
    }

    body{
        font-family: 'Nunito', sans-serif;
        font-size: clamp(1rem,1.5vw,1.2rem);
        overflow: hidden;
        color: var(--body-color);
    }
    .error{
        color: red;
        animation: shake 0.5s ease-in-out;
        @keyframes shake {
            0% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(10px);
            }
            50% {
                transform: translateX(-10px);
            }
            75% {
                transform: translateX(10px);
            }
            100% {
                transform: translateX(0);
            }
        }
    }
`;