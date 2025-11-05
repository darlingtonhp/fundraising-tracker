import { forwardRef } from 'react';

const TextArea = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <textarea
            {...props}
            ref={ref}
            className={
                `border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ` +
                className
            }
        />
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;