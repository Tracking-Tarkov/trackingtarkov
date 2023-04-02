import { useState, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../../utils/firebase';
import {
    ref,
    onValue,
    DataSnapshot,
    set
} from 'firebase/database';
import { Item } from '../../App';
import camelCase from 'lodash/camelCase';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';

import './styles/itemcard.scss';

export interface ItemCardProps {
    data: Item;
}

const ItemCard = ({ data }: ItemCardProps) => {
    const [user] = useAuthState(auth);
    const [itemCount, setItemCount] = useState<number>(0);

    useEffect(() => {
        if (!user) return;

        const itemCountRef = ref(
            database,
            `users/${user.uid}/items/${camelCase(data.name)}`
        );

        const snapshotCallback = (snapshot: DataSnapshot) => {
            const itemCount = snapshot.val();
            setItemCount(itemCount ?? 0);
        };

        onValue(itemCountRef, snapshotCallback);
    }, [user, data]);

    const buttonAction = useCallback(
        (amount: number) => () => {
            if (!user || amount > data.amount || amount < 0) return;

            const itemCountRef = ref(
                database,
                `users/${user.uid}/items/${camelCase(data.name)}`
            );
            set(itemCountRef, amount);
        },
        [user, data]
    );

    return (
        <div className="item-fir-card">
            <Card
                sx={{
                    minWidth: 280,
                    height: 250,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <CardMedia
                    sx={{ objectFit: 'contain' }}
                    component="img"
                    image={data.icon.url}
                />
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontSize: 18, height: 20 }}
                    >
                        {data.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <div className="item-card-actions">
                        <IconButton
                            size="small"
                            className="item-card-action"
                            sx={{ borderRadius: 1 }}
                            onClick={buttonAction(itemCount - 1)}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <Button
                            size="small"
                            className="item-card-action"
                            sx={{ color: 'white' }}
                            onClick={buttonAction(
                                itemCount === data.amount ? 0 : data.amount
                            )}
                        >
                            {itemCount}/{data.amount}
                        </Button>
                        <IconButton
                            size="small"
                            className="item-card-action"
                            sx={{ borderRadius: 1 }}
                            onClick={buttonAction(itemCount + 1)}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                </CardActions>
            </Card>
        </div>
    );
};

export default ItemCard;
