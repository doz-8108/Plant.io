module.exports = {
	mode: "jit",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}"
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		backgroundSize: {
			"2x": "200%"
		},
		backgroundPosition: {
			"pos-cardList": "50% 70%",
			"pos-userSideNav": "left bottom",
			"pos-adminSideNav": "center bottom",
			"pos-userOrderList": "right bottom",
			"pos-faq": "right bottom"
		},
		backgroundImage: {
			faq: "url('/faq-bg.svg')",
			userSideNav: "url('/user-sidenav-bg.svg')",
			adminSideNav: "url('/admin-sidenav-bg.svg')",
			cardList: "url('/cardList-bg.svg')",
			userOrderList: "url('/userOrderList-bg.svg')",
			"dashboard-profit-1":
				"linear-gradient(to right bottom, #3FFFAF, #38e190)",
			shimmer: "linear-gradient(to right, #f9fafb 0%, #eee 40%,  #f9fafb 60%)"
		},
		fill: {
			none: "none"
		},
		minHeight: {
			"100vh": "100vh",
			maxContent: "max-content"
		},
		minWidth: {
			maxContent: "max-content"
		},
		fontFamily: {
			grace: ["Covered By Your Grace", "cursive"],
			monsterrat: ["Montserrat", "sans-serif"],
			kumbh: ["Kumbh Sans", "sans-serif"]
		},
		extend: {
			keyframes: {
				heroTextLeft: {
					"0%": { visibility: "0", opacity: "0", left: "-10rem" },
					"80%": { visibility: "0.8", opacity: "0.8", left: "1rem" },
					"100%": { visibility: "1", opacity: "1", left: "0rem" }
				},
				heroTextRight: {
					"0%": { visibility: "0", opacity: "0", right: "-10rem" },
					"80%": { visibility: "0.8", opacity: "0.8", right: "1rem" },
					"100%": { visibility: "1", opacity: "1", right: "0rem" }
				},
				heroArrow: {
					"0%": { visibility: "0", opacity: "0", top: "-2rem" },
					"100%": { visibility: "1", opacity: "1", top: "0rem" }
				},
				composeComment: {
					"0%": { transform: "translateY(-10rem)" },
					"100%": { transform: "translateY(0rem)" }
				},
				shimmer: {
					"0%": {
						"background-position": "0%"
					},

					"50%": {
						" background-position": "100%"
					},

					"100% ": {
						" background-position": "200%"
					}
				},
				sideNavL2R: {
					"0%": {
						transform: "translateX(-100%)"
					},
					"100%": {
						transform: "translateX(0)"
					}
				}
			},
			animation: {
				heroTextLeft: "heroTextLeft 1.2s ease-in",
				heroTextRight: "heroTextRight 1.2s ease-in",
				heroArrow: "heroArrow .5s .5s ease-in backwards",
				composeComment: "composeComment .3s ease-in",
				shimmer: "shimmer 3s infinite",
				sideNavL2R: "sideNavL2R .3s ease-in"
			},
			colors: {
				"color-primary": "var(--color-primary)",
				"color-primary-light": "var(--color-primary-light)",
				"color-primary-hover": "var(--color-primary-hover)",
				"color-secondary": "var(--color-secondary)",
				"color-secondary-light": "var(--color-secondary-light)",
				"color-white": "#fff"
			},
			transitionProperty: {
				width: "width",
				display: "block"
			},
			transitionDuration: ["hover", "focus"],
			screens: {
				"2.5xl": "1800px",
				"3xl": "2000px"
			},
			gridTemplateColumns: {
				productCard: "80vw",
				"productPage-wide-screen": "40% 40%",
				"productPage-narrow-screen": "50% 50%",
				// "productPage-tablet-screen": "",
				cart: "60% 40%"
			},
			gridTemplateRows: {
				"productPage-lg": "repeat(2, max-content)"
			}
		},
		zIndex: {
			999: "999",
			998: "998"
		}
	},
	variants: {
		extend: {
			animation: ["group-hover", "hover"]
		}
	},
	plugins: [require("tailwind-scrollbar-hide")]
};
