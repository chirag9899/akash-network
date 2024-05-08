module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        'akash-red': '#ff414c',
        'akash-gray': '#f9f9f9', // Light background for the social media button area
        primary: '#ff414c', // accent color
        'primary-text': '#11181C', // primary text color
        'secondary-text': '#6b7689', // secondary text color
        'primary-dark': '#c8323c', // Darker shade for hover states
      },
      boxShadow: {
        'strong': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)', // Close approximation
      },
      borderRadius: {
        'xl': '12px',
      },
      backgroundColor: theme => ({
        'page': '#ffffff', // background color
      }),
    },
  },
  plugins: [],
}
