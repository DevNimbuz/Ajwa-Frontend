import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/packages', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'pkg-123',
          slug: 'maldives-package',
          name: 'Maldives Paradise',
          title: 'Maldives Trip',
          tagline: 'Best of Maldives',
          heroImg: 'http://example.com/hero.jpg',
          startingPrice: 50000,
          duration: '4 Days / 3 Nights',
        }
      ]
    });
  }),
  http.post('*/api/leads', () => {
    return HttpResponse.json({
      success: true,
      message: 'Thank you! We will contact you shortly.',
      data: { id: 'lead-123' }
    });
  })
];
