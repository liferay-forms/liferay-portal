/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.segments.asah.connector.internal.messaging.test;

import com.liferay.analytics.settings.configuration.AnalyticsConfiguration;
import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.configuration.test.util.CompanyConfigurationTemporarySwapper;
import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.settings.SettingsFactoryUtil;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.HashMapDictionaryBuilder;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.ProxyUtil;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;
import com.liferay.segments.constants.SegmentsEntryConstants;
import com.liferay.segments.model.SegmentsEntry;
import com.liferay.segments.model.SegmentsEntryRel;
import com.liferay.segments.service.SegmentsEntryLocalService;
import com.liferay.segments.service.SegmentsEntryRelLocalService;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.osgi.util.tracker.ServiceTracker;

/**
 * @author Mikel Lorza
 */
@RunWith(Arquillian.class)
public class IndividualSegmentsCheckerTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Before
	public void setUp() throws Exception {
		_user = TestPropsValues.getUser();

		Bundle bundle = FrameworkUtil.getBundle(
			IndividualSegmentsCheckerTest.class);

		_serviceTracker = new ServiceTracker<>(
			bundle.getBundleContext(),
			FrameworkUtil.createFilter(
				"(component.name=com.liferay.segments.asah.connector." +
					"internal.messaging.IndividualSegmentsChecker)"),
			null);

		_serviceTracker.open();

		_individualSegmentsChecker = _serviceTracker.getService();

		Assert.assertNotNull(_individualSegmentsChecker);
	}

	@After
	public void tearDown() {
		if (_serviceTracker != null) {
			_serviceTracker.close();
		}
	}

	@Test
	public void testCheckIndividualSegments() throws Exception {
		try (CompanyConfigurationTemporarySwapper
				companyConfigurationTemporarySwapper =
					new CompanyConfigurationTemporarySwapper(
						TestPropsValues.getCompanyId(),
						AnalyticsConfiguration.class.getName(),
						HashMapDictionaryBuilder.<String, Object>put(
							"liferayAnalyticsDataSourceId", "123456789"
						).put(
							"liferayAnalyticsEnableAllGroupIds", true
						).put(
							"liferayAnalyticsFaroBackendSecuritySignature",
							RandomTestUtil.randomString()
						).put(
							"liferayAnalyticsFaroBackendURL",
							RandomTestUtil.randomString()
						).build(),
						SettingsFactoryUtil.getSettingsFactory())) {

			Object asahFaroBackendClient = ReflectionTestUtil.getFieldValue(
				_individualSegmentsChecker, "_asahFaroBackendClient");

			ReflectionTestUtil.setFieldValue(
				asahFaroBackendClient, "_http",
				_geHttp(
					HashMapBuilder.
						<String, UnsafeSupplier<String, Exception>>put(
							"/api/1.0/individual-segments",
							() -> JSONUtil.put(
								"_embedded",
								JSONUtil.put(
									"individual-segments",
									JSONUtil.putAll(
										JSONUtil.put(
											"id", "1234567"
										).put(
											"name", "Test segment"
										)))
							).put(
								"page",
								JSONUtil.put(
									"number", 0
								).put(
									"size", 100
								).put(
									"totalElements", 1
								).put(
									"totalPages", 1
								)
							).put(
								"total", 0
							).toString()
						).put(
							"/api/1.0/individual-segments/1234567/individuals",
							() -> JSONUtil.put(
								"_embedded",
								JSONUtil.put(
									"individuals",
									JSONUtil.putAll(
										JSONUtil.put(
											"dataSourceIndividualPKs",
											JSONUtil.putAll(
												JSONUtil.put(
													"dataSourceId", "123456789"
												).put(
													"individualPKs",
													JSONUtil.putAll(
														_user.getUuid())
												)))))
							).put(
								"page",
								JSONUtil.put(
									"number", 0
								).put(
									"size", 100
								).put(
									"totalElements", 1
								).put(
									"totalPages", 1
								)
							).put(
								"total", 0
							).toString()
						).build()));

			ReflectionTestUtil.invoke(
				_individualSegmentsChecker, "checkIndividualSegments",
				new Class<?>[0]);

			List<SegmentsEntry> segmentsEntries =
				_segmentsEntryLocalService.getSegmentsEntriesBySource(
					SegmentsEntryConstants.SOURCE_ASAH_FARO_BACKEND,
					QueryUtil.ALL_POS, QueryUtil.ALL_POS, null);

			Assert.assertEquals(
				segmentsEntries.toString(), 1, segmentsEntries.size());

			SegmentsEntry segmentsEntry = segmentsEntries.get(0);

			Assert.assertEquals(StringPool.BLANK, segmentsEntry.getCriteria());
			Assert.assertEquals(
				"Test segment",
				segmentsEntry.getName(LocaleUtil.getSiteDefault()));

			List<SegmentsEntryRel> segmentsEntryRels =
				_segmentsEntryRelLocalService.getSegmentsEntryRels(
					segmentsEntry.getSegmentsEntryId());

			Assert.assertEquals(
				segmentsEntryRels.toString(), 1, segmentsEntryRels.size());

			SegmentsEntryRel segmentsEntryRel = segmentsEntryRels.get(0);

			Assert.assertEquals(
				_user.getUserId(), segmentsEntryRel.getClassPK());
		}
	}

	private Http _geHttp(
		Map<String, UnsafeSupplier<String, Exception>> unsafeSuppliers) {

		return (Http)ProxyUtil.newProxyInstance(
			Http.class.getClassLoader(), new Class<?>[] {Http.class},
			(proxy, method, args) -> {
				if (!Objects.equals("URLtoString", method.getName()) ||
					(args.length != 1) || !(args[0] instanceof Http.Options)) {

					return null;
				}

				Http.Options options = (Http.Options)args[0];

				try {
					String location = options.getLocation();

					int index = location.length();

					if (location.contains("?")) {
						index = location.indexOf("?");
					}

					String endpoint = location.substring(
						location.lastIndexOf("/api"), index);

					if (unsafeSuppliers.containsKey(endpoint)) {
						Http.Response httpResponse = new Http.Response();

						httpResponse.setResponseCode(200);

						options.setResponse(httpResponse);

						UnsafeSupplier<String, Exception> unsafeSupplier =
							unsafeSuppliers.get(endpoint);

						return unsafeSupplier.get();
					}

					Http.Response httpResponse = new Http.Response();

					httpResponse.setResponseCode(400);

					options.setResponse(httpResponse);

					return "error";
				}
				catch (Throwable throwable) {
					Http.Response httpResponse = new Http.Response();

					httpResponse.setResponseCode(400);

					options.setResponse(httpResponse);

					throw new RuntimeException(throwable);
				}
			});
	}

	private Object _individualSegmentsChecker;

	@Inject
	private SegmentsEntryLocalService _segmentsEntryLocalService;

	@Inject
	private SegmentsEntryRelLocalService _segmentsEntryRelLocalService;

	private ServiceTracker<Object, Object> _serviceTracker;
	private User _user;

	@Inject
	private UserLocalService _userLocalService;

}