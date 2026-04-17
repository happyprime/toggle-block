// WordPress dependencies.
import { BlockIcon } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import {
	Button,
	Modal,
	Notice,
	SearchControl,
	TextControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Recursively flatten a tree of blocks into a single array.
 *
 * @param {Array} blocks Blocks from the block-editor store.
 * @returns {Array} Flat list in document order.
 */
const flattenBlocks = (blocks) => {
	const result = [];
	for (const block of blocks) {
		result.push(block);
		if (block.innerBlocks?.length) {
			result.push(...flattenBlocks(block.innerBlocks));
		}
	}
	return result;
};

/**
 * Pull a short preview string out of a block's attributes.
 *
 * @param {object} block A block object from the block-editor store.
 * @returns {string} A short, plain-text preview, or an empty string.
 */
const getBlockPreview = (block) => {
	const candidates = [
		block.attributes?.content,
		block.attributes?.text,
		block.attributes?.title,
		block.attributes?.label,
		block.attributes?.value,
		block.attributes?.citation,
		block.attributes?.caption,
	];

	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate.trim()) {
			const stripped = candidate.replace(/<[^>]+>/g, '').trim();
			if (stripped) {
				return stripped.length > 80
					? stripped.slice(0, 80) + '…'
					: stripped;
			}
		}
	}

	return '';
};

/**
 * Produce a reasonably unique anchor for a block that doesn't yet have one.
 *
 * @param {object} block    A block object from the block-editor store.
 * @param {Set}    existing A set of anchor IDs that are already in use.
 * @returns {string} A unique anchor string.
 */
const generateAnchor = (block, existing) => {
	const base = (block.name || 'block').replace(/.*\//, '');
	let attempt;
	do {
		attempt = `${base}-${Math.random().toString(36).slice(2, 8)}`;
	} while (existing.has(attempt));
	return attempt;
};

const BlockSelector = ({ clientId, controlsId, setAttributes }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [showManual, setShowManual] = useState(false);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const allBlocks = useSelect(
		(select) => flattenBlocks(select('core/block-editor').getBlocks()),
		[]
	);

	const existingAnchors = useMemo(() => {
		const set = new Set();
		for (const block of allBlocks) {
			if (block.attributes?.anchor) {
				set.add(block.attributes.anchor);
			}
		}
		return set;
	}, [allBlocks]);

	const selectedBlock = useMemo(() => {
		if (!controlsId) {
			return null;
		}
		return (
			allBlocks.find(
				(block) => block.attributes?.anchor === controlsId
			) || null
		);
	}, [allBlocks, controlsId]);

	const candidates = useMemo(() => {
		return allBlocks.filter((block) => {
			if (block.clientId === clientId) {
				return false;
			}
			if (block.name === 'happyprime/toggle-block') {
				return false;
			}
			return true;
		});
	}, [allBlocks, clientId]);

	const filtered = useMemo(() => {
		if (!search.trim()) {
			return candidates;
		}
		const needle = search.toLowerCase();
		return candidates.filter((block) => {
			const blockType = getBlockType(block.name);
			const title = (blockType?.title || block.name).toLowerCase();
			const anchor = (block.attributes?.anchor || '').toLowerCase();
			const preview = getBlockPreview(block).toLowerCase();
			return (
				title.includes(needle) ||
				anchor.includes(needle) ||
				preview.includes(needle)
			);
		});
	}, [candidates, search]);

	const selectBlock = (block) => {
		let anchor = block.attributes?.anchor;

		if (!anchor) {
			anchor = generateAnchor(block, existingAnchors);
			updateBlockAttributes(block.clientId, { anchor });
		}

		setAttributes({ controlsId: anchor });
		setIsOpen(false);
		setSearch('');
	};

	const clearSelection = () => {
		setAttributes({ controlsId: '' });
	};

	const selectedBlockType = selectedBlock
		? getBlockType(selectedBlock.name)
		: null;

	return (
		<div className="toggle-block-selector">
			{selectedBlock ? (
				<div className="toggle-block-selector__current">
					<div className="toggle-block-selector__current-header">
						{selectedBlockType?.icon && (
							<BlockIcon icon={selectedBlockType.icon} />
						)}
						<span className="toggle-block-selector__current-title">
							{selectedBlockType?.title || selectedBlock.name}
						</span>
					</div>
					<code className="toggle-block-selector__current-anchor">
						#{controlsId}
					</code>
					{getBlockPreview(selectedBlock) && (
						<p className="toggle-block-selector__current-preview">
							{getBlockPreview(selectedBlock)}
						</p>
					)}
				</div>
			) : controlsId ? (
				<div className="toggle-block-selector__current toggle-block-selector__current--orphan">
					<Notice status="warning" isDismissible={false}>
						{sprintf(
							/* translators: %s: anchor id */
							__(
								'No block with anchor "%s" was found in this post. The toggle will still target this ID at runtime.',
								'toggle-block'
							),
							controlsId
						)}
					</Notice>
				</div>
			) : (
				<p className="toggle-block-selector__empty">
					{__(
						'No block selected. Browse available blocks to choose which one this toggle controls.',
						'toggle-block'
					)}
				</p>
			)}

			<div className="toggle-block-selector__actions">
				<Button variant="secondary" onClick={() => setIsOpen(true)}>
					{selectedBlock || controlsId
						? __('Change block', 'toggle-block')
						: __('Browse blocks', 'toggle-block')}
				</Button>
				{controlsId && (
					<Button
						variant="tertiary"
						isDestructive
						onClick={clearSelection}
					>
						{__('Clear', 'toggle-block')}
					</Button>
				)}
			</div>

			<Button
				variant="link"
				className="toggle-block-selector__manual-toggle"
				onClick={() => setShowManual((v) => !v)}
			>
				{showManual
					? __('Hide manual ID entry', 'toggle-block')
					: __('Enter ID manually', 'toggle-block')}
			</Button>

			{showManual && (
				<TextControl
					label={__('Controls ID', 'toggle-block')}
					help={__(
						'Enter the HTML anchor ID of the element this toggle controls. Useful when the target lives outside this post.',
						'toggle-block'
					)}
					value={controlsId}
					onChange={(value) => setAttributes({ controlsId: value })}
				/>
			)}

			{isOpen && (
				<Modal
					title={__('Select a block to toggle', 'toggle-block')}
					onRequestClose={() => {
						setIsOpen(false);
						setSearch('');
					}}
					className="toggle-block-selector__modal"
				>
					<SearchControl
						value={search}
						onChange={setSearch}
						label={__('Search blocks', 'toggle-block')}
						placeholder={__(
							'Search by block type, content, or anchor…',
							'toggle-block'
						)}
					/>

					{filtered.length === 0 ? (
						<p className="toggle-block-selector__no-results">
							{candidates.length === 0
								? __(
										'No other blocks in this post yet. Add the content you want to toggle first.',
										'toggle-block'
									)
								: __(
										'No blocks match your search.',
										'toggle-block'
									)}
						</p>
					) : (
						<ul className="toggle-block-selector__list">
							{filtered.map((block) => {
								const blockType = getBlockType(block.name);
								const preview = getBlockPreview(block);
								const anchor = block.attributes?.anchor;
								const isSelected =
									anchor && anchor === controlsId;

								return (
									<li
										key={block.clientId}
										className={
											'toggle-block-selector__list-item' +
											(isSelected ? ' is-selected' : '')
										}
									>
										<button
											type="button"
											className="toggle-block-selector__list-button"
											onClick={() => selectBlock(block)}
										>
											<span className="toggle-block-selector__list-icon">
												{blockType?.icon && (
													<BlockIcon
														icon={blockType.icon}
													/>
												)}
											</span>
											<span className="toggle-block-selector__list-body">
												<span className="toggle-block-selector__list-title">
													{blockType?.title ||
														block.name}
												</span>
												{preview && (
													<span className="toggle-block-selector__list-preview">
														{preview}
													</span>
												)}
												<span className="toggle-block-selector__list-anchor">
													{anchor
														? `#${anchor}`
														: __(
																'No anchor set — one will be generated.',
																'toggle-block'
															)}
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</Modal>
			)}
		</div>
	);
};

export default BlockSelector;
