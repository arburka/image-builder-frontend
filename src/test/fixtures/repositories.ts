import {
  ApiLinks,
  ApiRepositoryResponse,
  ApiRepositoryResponseRead,
  ApiResponseMetadata,
  ListRepositoriesApiArg,
} from '../../store/contentSourcesApi';

type repoArgs = {
  available_for_arch: ListRepositoriesApiArg['availableForArch'];
  available_for_version: ListRepositoriesApiArg['availableForVersion'];
  limit: ListRepositoriesApiArg['limit'];
  offset: ListRepositoriesApiArg['offset'];
  search: ListRepositoriesApiArg['search'];
};

export const mockRepositoryResults = (request: repoArgs) => {
  const repos = filterRepos(request);
  const limit = request.limit ? request.limit : 100;
  const data = repos.slice(request.offset, limit);
  const meta = generateMeta(request.limit, request.offset, repos.length);
  const links = generateLinks(request.limit, request.offset);
  const response = {
    data: data,
    meta: meta,
    links: links,
  };
  return response;
};

const numFillerRepos = 1000;

const filterRepos = (args: repoArgs): ApiRepositoryResponse[] => {
  let repos = testingRepos;

  args.available_for_arch &&
    (repos = repos.filter(
      (repo) =>
        repo.distribution_arch === 'any' ||
        repo.distribution_arch === args.available_for_arch
    ));

  args.available_for_version &&
    (repos = repos.filter((repo) => {
      return (
        repo.distribution_versions?.includes(args.available_for_version!) ||
        repo.distribution_versions?.includes('any')
      );
    }));

  // Filler repos will always appear in response as they have distribution_versions
  // and distribution_arch of 'any'. High count is useful for testing pagination.
  const fillerRepos = generateFillerRepos(numFillerRepos);

  repos = [...repos, ...fillerRepos];

  args.search &&
    (repos = repos.filter(
      (repo) =>
        repo.name?.includes(args.search!) || repo.url?.includes(args.search!)
    ));

  return repos;
};

const testingRepos: ApiRepositoryResponseRead[] = [
  {
    uuid: 'dbad4dfc-1547-45f8-b5af-1d7fec0476c6',
    name: '13lk3',
    url: 'http://yum.theforeman.org/releases/3.4/el8/x86_64/',
    distribution_versions: ['8'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:54:00Z',
    last_success_introspection_time: '2022-11-23T08:54:00Z',
    last_update_introspection_time: '2022-10-04T00:18:12Z',
    last_introspection_error: '',
    package_count: 605,
    status: 'Valid',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'ae39f556-6986-478a-95d1-f9c7e33d066c',
    name: '01-test-valid-repo',
    url: 'http://valid.link.to.repo.org/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:54:00Z',
    last_success_introspection_time: '2022-11-23T08:54:00Z',
    last_update_introspection_time: '2022-10-04T00:18:12Z',
    last_introspection_error: '',
    package_count: 13,
    status: 'Valid',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'ae39f556-6986-478a-95d1-f9c7e33d066c',
    name: '02-test-invalid-repo',
    url: 'http://invalid.link.to.repo.org/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:54:00Z',
    last_success_introspection_time: '2022-11-23T08:54:00Z',
    last_update_introspection_time: '2022-10-04T00:18:12Z',
    last_introspection_error: '',
    package_count: 13,
    status: 'Invalid',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'd4b6d3db-bd15-4750-98c0-667f42995566',
    name: '03-test-unavailable-repo',
    url: 'http://unreachable.link.to.repo.org/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:54:00Z',
    last_success_introspection_time: '2022-11-23T08:54:00Z',
    last_update_introspection_time: '2022-10-04T00:18:12Z',
    last_introspection_error: '',
    package_count: 23,
    status: 'Unavailable',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '81091684-4708-11ee-be56-0242ac120002',
    name: '04-test-pending-repo',
    url: 'http://pending.link.to.repo.org/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:54:00Z',
    last_success_introspection_time: '2022-11-23T08:54:00Z',
    last_update_introspection_time: '2022-10-04T00:18:12Z',
    last_introspection_error: '',
    package_count: 33,
    status: 'Pending',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '9cf1d45d-aa06-46fe-87ea-121845cc6bbb',
    name: '2lmdtj',
    url: 'http://mirror.stream.centos.org/SIGs/8/kmods/x86_64/packages-main/',
    distribution_versions: ['8'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T00:00:12Z',
    last_success_introspection_time: '2022-11-23T00:00:12Z',
    last_update_introspection_time: '2022-11-18T08:00:10Z',
    last_introspection_error: '',
    package_count: 21,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: true,
  },
  {
    uuid: '828e7db8-c0d4-48fc-a887-9070e0e75c45',
    name: '2zmya',
    url: 'https://download-i2.fedoraproject.org/pub/epel/9/Everything/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:18Z',
    last_success_introspection_time: '2022-11-23T08:00:18Z',
    last_update_introspection_time: '2022-11-23T08:00:18Z',
    last_introspection_error: '',
    package_count: 11526,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'ffe90892-6e6c-43c0-a284-df78977d8e37',
    name: '4tnt6f',
    url: 'https://mirror.linux.duke.edu/pub/centos/8-stream/BaseOS/x86_64/os/',
    distribution_versions: ['9'],
    distribution_arch: 'aarch64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-22T16:00:06Z',
    last_success_introspection_time: '2022-11-22T16:00:06Z',
    last_update_introspection_time: '2022-10-04T00:06:03Z',
    last_introspection_error: '',
    package_count: 11908,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '744000a5-fde5-481d-a1ae-07f27e7f4db9',
    name: '76nlti',
    url: 'https://download-i2.fedoraproject.org/pub/epel/7/x86_64/',
    distribution_versions: ['8', '9'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:01:28Z',
    last_success_introspection_time: '2022-11-23T08:01:28Z',
    last_update_introspection_time: '2022-11-23T08:01:28Z',
    last_introspection_error: '',
    package_count: 13739,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '45068247-67b9-4f6d-8f19-1718ab56586e',
    name: '938l0k',
    url: 'http://yum.theforeman.org/client/3.4/el8/x86_64/',
    distribution_versions: ['7'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:20Z',
    last_success_introspection_time: '2022-11-23T08:00:20Z',
    last_update_introspection_time: '2022-10-04T00:18:10Z',
    last_introspection_error: '',
    package_count: 17,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '60887c35-ce7a-4abc-8c57-1cb8a596f63d',
    name: 'a6vac',
    url: 'http://mirror.stream.centos.org/9-stream/AppStream/x86_64/os/',
    distribution_versions: ['7'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:21Z',
    last_success_introspection_time: '2022-11-23T08:00:21Z',
    last_update_introspection_time: '2022-09-20T00:21:01Z',
    last_introspection_error: '',
    package_count: 0,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'f033a5af-ae00-4c26-8bb9-7329d4f17180',
    name: 'abi7n',
    url: 'http://yum.theforeman.org/katello/4.6/katello/el8/x86_64/',
    distribution_versions: ['7'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:01:31Z',
    last_success_introspection_time: '2022-11-23T08:01:31Z',
    last_update_introspection_time: '2022-10-04T00:11:04Z',
    last_introspection_error: '',
    package_count: 102,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'be0fd64b-b7d0-48f1-b671-4c74b93a42d2',
    name: 'g2ikq',
    url: 'http://yum.theforeman.org/client/3.4/el9/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:21Z',
    last_success_introspection_time: '2022-11-23T08:00:21Z',
    last_update_introspection_time: '2022-10-04T00:18:10Z',
    last_introspection_error: '',
    package_count: 11,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'bf5270e6-0559-469b-a4bd-9c881f603813',
    name: 'gnome-shell-extensions',
    url: 'https://gitlab.gnome.org/GNOME/gnome-shell-extensions/',
    distribution_versions: ['any'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:01:33Z',
    last_success_introspection_time: '',
    last_update_introspection_time: '',
    last_introspection_error:
      'error parsing repomd.xml: xml.Unmarshal failure: expected element type <repomd> but have <html>',
    package_count: 0,
    status: 'Invalid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '31ae1b1c-0a14-46df-a6d4-4170f88abeee',
    name: 'i9arb',
    url: 'http://yum.theforeman.org/pulpcore/3.18/el8/x86_64/',
    distribution_versions: ['7'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T00:00:12Z',
    last_success_introspection_time: '2022-11-23T00:00:12Z',
    last_update_introspection_time: '2022-11-12T00:00:18Z',
    last_introspection_error: '',
    package_count: 340,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'ea375230-32f7-490d-82b6-501f0a8c2932',
    name: 'ixgwo',
    url: 'http://yum.theforeman.org/client/3.3/el7/x86_64/',
    distribution_versions: ['7'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:37Z',
    last_success_introspection_time: '2022-11-23T08:00:37Z',
    last_update_introspection_time: '2022-10-10T16:11:35Z',
    last_introspection_error: '',
    package_count: 14,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'aa9506b1-e5dd-42be-b5b0-a674f4db915f',
    name: 'k64ic',
    url: 'http://yum.theforeman.org/pulpcore/3.18/el9/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:18Z',
    last_success_introspection_time: '2022-11-23T08:00:18Z',
    last_update_introspection_time: '2022-11-12T00:00:08Z',
    last_introspection_error: '',
    package_count: 338,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '3cce24d2-41e2-481d-8f01-2b043c72fd6f',
    name: 'lrqm',
    url: 'http://yum.theforeman.org/client/3.3/el8/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:11Z',
    last_success_introspection_time: '2022-11-23T08:00:11Z',
    last_update_introspection_time: '2022-10-10T16:01:36Z',
    last_introspection_error: '',
    package_count: 16,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'c988934a-87e2-482f-b887-d9ba677a037a',
    name: 'mo1qy',
    url: 'https://download-i2.fedoraproject.org/pub/epel/8/Everything/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:09Z',
    last_success_introspection_time: '2022-11-23T08:00:09Z',
    last_update_introspection_time: '2022-11-23T08:00:09Z',
    last_introspection_error: '',
    package_count: 9452,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'bbc2bba5-9d7d-4726-b96f-a48408e130b5',
    name: 's2h9z',
    url: 'http://mirror.stream.centos.org/9-stream/BaseOS/x86_64/os/',
    distribution_versions: ['7'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-22T16:00:06Z',
    last_success_introspection_time: '2022-11-22T16:00:06Z',
    last_update_introspection_time: '2022-09-20T00:27:02Z',
    last_introspection_error: '',
    package_count: 0,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '593a973b-715f-4867-ae9c-fa791b59b92d',
    name: 'v9h0m',
    url: 'http://yum.theforeman.org/pulpcore/3.18/el7/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:19Z',
    last_success_introspection_time: '2022-11-23T08:00:19Z',
    last_update_introspection_time: '2022-11-13T00:00:25Z',
    last_introspection_error: '',
    package_count: 259,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'd08a74ef-589b-486f-aae0-60c6abe25768',
    name: 'vbazm',
    url: 'http://yum.theforeman.org/client/3.4/el7/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:37Z',
    last_success_introspection_time: '2022-11-23T08:00:37Z',
    last_update_introspection_time: '2022-10-04T00:18:09Z',
    last_introspection_error: '',
    package_count: 15,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '0a12a77d-c3fa-4cd7-958b-ecbec1fd1494',
    name: 'vv5jk',
    url: 'http://yum.theforeman.org/client/3.2/el7/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'any',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T00:00:20Z',
    last_success_introspection_time: '2022-11-23T00:00:20Z',
    last_update_introspection_time: '2022-10-04T00:20:17Z',
    last_introspection_error: '',
    package_count: 14,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: '5288c386-274c-4598-8f09-0e2f65346e0d',
    name: 'ycxvp',
    url: 'https://dl.google.com/linux/chrome/rpm/stable/x86_64/',
    distribution_versions: ['any'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:09Z',
    last_success_introspection_time: '2022-11-23T08:00:09Z',
    last_update_introspection_time: '2022-11-18T08:00:13Z',
    last_introspection_error: '',
    package_count: 3,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'f087f9ad-dfe6-4627-9d53-336c09886cd4',
    name: 'yzfsx',
    url: 'http://yum.theforeman.org/client/3.3/el9/x86_64/',
    distribution_versions: ['7'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:22Z',
    last_success_introspection_time: '2022-11-23T08:00:22Z',
    last_update_introspection_time: '2022-10-10T16:00:18Z',
    last_introspection_error: '',
    package_count: 11,
    status: 'Valid',
    gpg_key: '',
    metadata_verification: false,
    module_hotfixes: false,
  },
  {
    uuid: 'f087f9ad-dfe6-4627-9d53-447d1a997de5',
    name: 'nginx stable repo',
    url: 'http://nginx.org/packages/centos/9/x86_64/',
    distribution_versions: ['9'],
    distribution_arch: 'x86_64',
    account_id: '6416440',
    org_id: '13476545',
    last_introspection_time: '2022-11-23T08:00:22Z',
    last_success_introspection_time: '2022-11-23T08:00:22Z',
    last_update_introspection_time: '2022-10-10T16:00:18Z',
    last_introspection_error: '',
    package_count: 25,
    status: 'Valid',
    gpg_key:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v2.0.22 (GNU/Linux)\n\nmQENBE5OMmIBCAD+FPYKGriGGf7NqwKfWC83cBV01gabgVWQmZbMcFzeW+hMsgxH\nW6iimD0RsfZ9oEbfJCPG0CRSZ7ppq5pKamYs2+EJ8Q2ysOFHHwpGrA2C8zyNAs4I\nQxnZZIbETgcSwFtDun0XiqPwPZgyuXVm9PAbLZRbfBzm8wR/3SWygqZBBLdQk5TE\nfDR+Eny/M1RVR4xClECONF9UBB2ejFdI1LD45APbP2hsN/piFByU1t7yK2gpFyRt\n97WzGHn9MV5/TL7AmRPM4pcr3JacmtCnxXeCZ8nLqedoSuHFuhwyDnlAbu8I16O5\nXRrfzhrHRJFM1JnIiGmzZi6zBvH0ItfyX6ttABEBAAG0KW5naW54IHNpZ25pbmcg\na2V5IDxzaWduaW5nLWtleUBuZ2lueC5jb20+iQE+BBMBAgAoAhsDBgsJCAcDAgYV\nCAIJCgsEFgIDAQIeAQIXgAUCV2K1+AUJGB4fQQAKCRCr9b2Ce9m/YloaB/9XGrol\nkocm7l/tsVjaBQCteXKuwsm4XhCuAQ6YAwA1L1UheGOG/aa2xJvrXE8X32tgcTjr\nKoYoXWcdxaFjlXGTt6jV85qRguUzvMOxxSEM2Dn115etN9piPl0Zz+4rkx8+2vJG\nF+eMlruPXg/zd88NvyLq5gGHEsFRBMVufYmHtNfcp4okC1klWiRIRSdp4QY1wdrN\n1O+/oCTl8Bzy6hcHjLIq3aoumcLxMjtBoclc/5OTioLDwSDfVx7rWyfRhcBzVbwD\noe/PD08AoAA6fxXvWjSxy+dGhEaXoTHjkCbz/l6NxrK3JFyauDgU4K4MytsZ1HDi\nMgMW8hZXxszoICTTiQEcBBABAgAGBQJOTkelAAoJEKZP1bF62zmo79oH/1XDb29S\nYtWp+MTJTPFEwlWRiyRuDXy3wBd/BpwBRIWfWzMs1gnCjNjk0EVBVGa2grvy9Jtx\nJKMd6l/PWXVucSt+U/+GO8rBkw14SdhqxaS2l14v6gyMeUrSbY3XfToGfwHC4sa/\nThn8X4jFaQ2XN5dAIzJGU1s5JA0tjEzUwCnmrKmyMlXZaoQVrmORGjCuH0I0aAFk\nRS0UtnB9HPpxhGVbs24xXZQnZDNbUQeulFxS4uP3OLDBAeCHl+v4t/uotIad8v6J\nSO93vc1evIje6lguE81HHmJn9noxPItvOvSMb2yPsE8mH4cJHRTFNSEhPW6ghmlf\nWa9ZwiVX5igxcvaIRgQQEQIABgUCTk5b0gAKCRDs8OkLLBcgg1G+AKCnacLb/+W6\ncflirUIExgZdUJqoogCeNPVwXiHEIVqithAM1pdY/gcaQZmIRgQQEQIABgUCTk5f\nYQAKCRCpN2E5pSTFPnNWAJ9gUozyiS+9jf2rJvqmJSeWuCgVRwCcCUFhXRCpQO2Y\nVa3l3WuB+rgKjsQ=\n=EWWI\n-----END PGP PUBLIC KEY BLOCK-----',
    metadata_verification: false,
    module_hotfixes: true,
  },
];

const generateMeta = (
  limit: ApiResponseMetadata['limit'],
  offset: ApiResponseMetadata['offset'],
  count: ApiResponseMetadata['count']
): ApiResponseMetadata => {
  return {
    limit: limit,
    offset: offset,
    count: count,
  };
};

const generateLinks = (
  limit: ApiResponseMetadata['limit'],
  offset: ApiResponseMetadata['offset']
): ApiLinks => {
  return {
    first: `/api/content-sources/v1/repositories/?limit=${limit}&offset=${offset}`,
    last: `/api/content-sources/v1/repositories/?limit=${limit}&offset=${offset}`,
  };
};

const generateFillerRepos = (num: number): ApiRepositoryResponse[] => {
  const repos = new Array(num).fill(undefined).map((_, i) => {
    return {
      uuid: '9cf1d45d-aa06-46fe-87ea-121845cc6bbb',
      name: `z-filler repo ${i}`,
      url: `http://fillerRepos.org/9/x86_64/packages/${i}`,
      distribution_versions: ['any'],
      distribution_arch: 'any',
      account_id: '6416440',
      org_id: '13476545',
      last_introspection_time: '2022-11-23T00:00:12Z',
      last_success_introspection_time: '2022-11-23T00:00:12Z',
      last_update_introspection_time: '2022-11-18T08:00:10Z',
      last_introspection_error: '',
      package_count: 21,
      status: 'Valid',
      gpg_key: '',
      metadata_verification: false,
      module_hotfixes: false,
    };
  });
  return repos;
};

export const mockPopularRepo = (repo_id: string) => {
  if (repo_id === '2b709339-2efe-4daa-b25a-316b1a9fed8d') {
    return {
      uuid: '2b709339-2efe-4daa-b25a-316b1a9fed8d',
      name: 'popular-repo-9',
      url: 'http://popularrepo.org/9/x86_64/',
      distribution_versions: ['9'],
      distribution_arch: 'any',
      account_id: '1234567',
      org_id: '12345678',
      last_introspection_time: '2022-11-23T08:54:00Z',
      last_success_introspection_time: '2022-11-23T08:54:00Z',
      last_update_introspection_time: '2022-10-04T00:18:12Z',
      last_introspection_error: '',
      package_count: 5,
      status: 'Valid',
      gpg_key:
        '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
      metadata_verification: false,
      module_hotfixes: false,
    };
  } else if (repo_id === '3012f536-eb7c-4cfc-838d-a0cfd553224c') {
    return {
      uuid: '3012f536-eb7c-4cfc-838d-a0cfd553224c',
      name: 'popular-repo-8',
      url: 'http://popularrepo.org/8/x86_64/',
      distribution_versions: ['8'],
      distribution_arch: 'any',
      account_id: '1234567',
      org_id: '12345678',
      last_introspection_time: '2022-11-23T08:54:00Z',
      last_success_introspection_time: '2022-11-23T08:54:00Z',
      last_update_introspection_time: '2022-10-04T00:18:12Z',
      last_introspection_error: '',
      package_count: 5,
      status: 'Valid',
      gpg_key:
        '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGN9300BEAC1FLODu0cL6saMMHa7yJY1JZUc+jQUI/HdECQrrsTaPXlcc7nM\nykYMMv6amPqbnhH/R5BW2Ano+OMse+PXtUr0NXU4OcvxbnnXkrVBVUf8mXI9DzLZ\njw8KoD+4/s0BuzO78zAJF5uhuyHMAK0ll9v0r92kK45Fas9iZTfRFcqFAzvgjScf\n5jeBnbRs5U3UTz9mtDy802mk357o1A8BD0qlu3kANDpjLbORGWdAj21A6sMJDYXy\nHS9FBNV54daNcr+weky2L9gaF2yFjeu2rSEHCSfkbWfpSiVUx/bDTj7XS6XDOuJT\nJqvGS8jHqjHAIFBirhCA4cY/jLKxWyMr5N6IbXpPAYgt8/YYz2aOYVvdyB8tZ1u1\nkVsMYSGcvTBexZCn1cDkbO6I+waIlsc0uxGqUGBKF83AVYCQqOkBjF1uNnu9qefE\nkEc9obr4JZsAgnisboU25ss5ZJddKlmFMKSi66g4S5ChLEPFq7MB06PhLFioaD3L\nEXza7XitoW5VBwr0BSVKAHMC0T2xbm70zY06a6gQRlvr9a10lPmv4Tptc7xgQReg\nu1TlFPbrkGJ0d8O6vHQRAd3zdsNaVr4gX0Tg7UYiqT9ZUkP7hOc8PYXQ28hHrHTB\nA63MTq0aiPlJ/ivTuX8M6+Bi25dIV6N6IOUi/NQKIYxgovJCDSdCAAM0fQARAQAB\ntCFMdWNhcyBHYXJmaWVsZCA8bHVjYXNAcmVkaGF0LmNvbT6JAlcEEwEIAEEWIQTO\nQZeiHnXqdjmfUURc6PeuecS2PAUCY33fTQIbAwUJA8JnAAULCQgHAgIiAgYVCgkI\nCwIEFgIDAQIeBwIXgAAKCRBc6PeuecS2PCk3D/9jW7xrBB/2MQFKd5l+mNMFyKwc\nL9M/M5RFI9GaQRo55CwnPb0nnxOJR1V5GzZ/YGii53H2ose65CfBOE2L/F/RvKF0\nH9S9MInixlahzzKtV3TpDoZGk5oZIHEMuPmPS4XaHggolrzExY0ib0mQuBBE/uEV\n/HlyHEunBKPhTkAe+6Q+2dl22SUuVfWr4Uzlp65+DkdN3M37WI1a3Suhnef3rOSM\nV6puUzWRR7qcYs5C2In87AcYPn92P5ur1y/C32r8Ftg3fRWnEzI9QfRG52ojNOLK\nyGQ8ZC9PGe0q7VFcF7ridT/uzRU+NVKldbJg+rvBnszb1MjNuR7rUQHyvGmbsUVQ\nRCsgdovkee3lP4gfZHzk2SSLVSo0+NJRNaM90EmPk14Pgi/yfRSDGBVvLBbEanYI\nv1ZtdIPRyKi+/IaMOu/l7nayM/8RzghdU+0f1FAif5qf9nXuI13P8fqcqfu67gNd\nkh0UUF1XyR5UHHEZQQDqCuKEkZJ/+27jYlsG1ZiLb1odlIWoR44RP6k5OJl0raZb\nyLXbAfpITsXiJJBpCam9P9+XR5VSfgkqp5hIa7J8piN3DoMpoExg4PPQr6PbLAJy\nOUCOnuB7yYVbj0wYuMXTuyrcBHh/UymQnS8AMpQoEkCLWS/A/Hze/pD23LgiBoLY\nXIn5A2EOAf7t2IMSlA==\n=OanT\n-----END PGP PUBLIC KEY BLOCK-----',
      metadata_verification: false,
      module_hotfixes: false,
    };
  }
};
