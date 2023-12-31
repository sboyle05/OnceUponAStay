import React from 'react';
import './SingleSpot.css';
import { fetchReceiveSpot } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { fetchDeleteReview, fetchLoadSpotReviews } from '../../store/reviews';
import { fetchUserReviews } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton';
import PostReviewModal from '../PostReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
import BookingsModal from '../bookingsModal';

const SingleSpot = () => {
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const { closeModal } = useModal();
	const history = useHistory();
	const [goToSpot, setGoToSpot] = useState(spotId);
	const spot = useSelector((state) => state.spots[spotId]);
	const sessionUser = useSelector((state) => state.session.user);
	const [userReviews, setUserReviews] = useState([]);
	const [hasReview, setHasReview] = useState(false);

	const reviewIds = useSelector(
		(state) => state.reviews.spotReviews && state.reviews.spotReviews[spotId]
	);

	const allReviews = useSelector((state) => state.reviews.reviews);

	const reviews = reviewIds && reviewIds.map((id) => allReviews[id]);

	useEffect(() => {
		if (sessionUser) {
			dispatch(fetchUserReviews())
				.then((reviews) => {
					const foundReview = Object.values(reviews).find((review) => {
						return review.spotId === +spotId;
					});
					if (foundReview) {
						setHasReview(true);
					}
				})
				.then(() => dispatch(fetchLoadSpotReviews(spotId)));
		}
	}, [sessionUser, dispatch, spotId]);

	useEffect(() => {
		dispatch(fetchReceiveSpot(spotId));
		dispatch(fetchLoadSpotReviews(spotId));
	}, [dispatch, spotId]);

	if (!spot || !spot.Owner || !spotId) return null;

	const canPostReview =
		sessionUser && sessionUser.id !== spot.Owner.id && !hasReview;

	const handleSubmit = (e) => {
		e.preventDefault();
		history.push(`/spots/${goToSpot}`);
	};

	const handleReviewDelete = () => {
		setHasReview(false);
		dispatch(fetchLoadSpotReviews(spotId));
		dispatch(fetchReceiveSpot(spotId));
	};

	//SESSION CODE FOR DELETE/POST REVIEW
	let postReviewButton;
	if (canPostReview) {
		postReviewButton = (
			<>
				<OpenModalButton
					modalComponent={
						<PostReviewModal spotId={spotId} setHasReview={setHasReview} />
					}
					buttonText='Post Review'
				/>
			</>
		);
	}

	return (
		<section className='singleSpot'>
			<section className='spotNameLocation'>
				<h1>{spot.name}</h1>
				<h3>
					{spot.city}, {spot.state}, {spot.country}
				</h3>
			</section>
			<section className='spotImages'>
				{Array.isArray(spot.SpotImages) &&
					spot.SpotImages.map((image, index) => (
						<img
							className={index === 0 ? 'large-image' : 'small-image'}
							key={index}
							src={image.url}
							alt={`${spot.name} ${index + 1}`}
						/>
					))}
			</section>
			<section className='spotInfo'>
				<section className='owner_des'>
					<div className='ownerInfo'>
						Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
					</div>
					<div className='spotDescription'>{spot.description}</div>
				</section>
				<section className='price_reserveButContainer'>
					<section className='priceAndReviews'>
						<div>${spot.price} night</div>

						<div className='reviewsStar'>
							{' '}
							<i className='fa-solid fa-star'></i> {spot.avgRating}
							{spot.numReviews > 1 ? (
								<span> &#x2022; {spot.numReviews} reviews</span>
							) : spot.numReviews === 1 ? (
								<span> &#x2022; {spot.numReviews} review</span>
							) : (
								<span> New</span>
							)}
						</div>
					</section>
					<section className='resBut'>
						{sessionUser ? (
							<OpenModalButton
								buttonText='Reserve'
								className='reserveButton'
								modalComponent={
									<BookingsModal spotId={spot.id} userId={sessionUser.id} />
								}
							/>
						) : (
							<button
								className='reserveButton'
								disabled
								onClick={() => history.push('/login')}
							>
								Login to Reserve
							</button>
						)}
					</section>
				</section>
			</section>

			<section className='reviews'>
				<span>
					<h1>
						<i className='fa-solid fa-star'></i> {spot.avgRating}{' '}
						{spot.numReviews > 1 ? (
							<span>&#x2022; {spot.numReviews} reviews</span>
						) : spot.numReviews === 1 ? (
							<span>&#x2022; {spot.numReviews} review</span>
						) : (
							<span>
								{' '}
								New <h2>Be the first to post a review!</h2>
							</span>
						)}
					</h1>
				</span>

				{postReviewButton}

				{Array.isArray(reviews) &&
					[...reviews]
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.map((review, index) => (
							<div key={index}>
								<section className='nametext'>
									{review.User?.firstName} {review.User?.lastName}
								</section>{' '}
								<section className='date'>
									<div>
										{new Date(review?.createdAt).toISOString().split('T')[0]}
									</div>
								</section>
								<section className='reviewcss'> {review?.review}</section>
								{sessionUser && sessionUser.id === review.userId && (
									<OpenModalButton
										className='deleteReviewButton'
										modalComponent={
											<DeleteReviewModal
												reviewId={review.id}
												onReviewDelete={handleReviewDelete}
												setHasReview={setHasReview}
											/>
										}
										buttonText='Delete Review'
									/>
								)}
							</div>
						))}
			</section>
		</section>
	);
};

export default SingleSpot;
