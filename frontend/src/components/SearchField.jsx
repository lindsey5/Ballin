import IconButton from '@mui/material/IconButton';

const Searchfield = ({ placeholder = 'Search', onChange, value, submit }) => {

    return (
        <form onSubmit={submit} className="flex-1 max-w-lg flex items-center rounded-full px-3 py-1 border border-gray-400">
            <input
                className="flex-1 w-full outline-none border-none md:py-2 md:px-3 py-1 text-md md:text-base"
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
            <IconButton size="small" type='submit'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 md:w-6 md:h-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                        clipRule="evenodd"
                    />
                </svg>
            </IconButton>
        </form>
    );
};

export default Searchfield;
