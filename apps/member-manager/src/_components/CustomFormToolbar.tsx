import {
    DeleteButton,
    RedirectionSideEffect,
    SaveButton,
    Toolbar,
} from 'react-admin';

const CustomFormToolbar = ({
    redirect,
}: {
    redirect: RedirectionSideEffect;
}) => {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
            <DeleteButton redirect={redirect} />
        </Toolbar>
    );
};      

export default CustomFormToolbar;
